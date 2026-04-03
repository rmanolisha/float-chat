from __future__ import annotations

import logging
import math
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from tempfile import NamedTemporaryFile

import numpy as np
import xarray as xr
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import Float, OceanMeasurement, Profile
from app.schemas.ingestion import NetCDFUploadResponse
from app.services.vector_service import vector_service

logger = logging.getLogger(__name__)


@dataclass
class ParsedProfile:
    cycle_number: int | None
    profile_time: datetime | None
    latitude: float | None
    longitude: float | None
    pressures: list[float | None]
    temperatures: list[float | None]
    salinities: list[float | None]


class NetCDFParsingError(ValueError):
    pass


class NetCDFIngestionService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def ingest_upload(self, db: Session, upload: UploadFile) -> NetCDFUploadResponse:
        self.settings.upload_tmp_dir.mkdir(parents=True, exist_ok=True)

        suffix = Path(upload.filename or "upload.nc").suffix or ".nc"
        with NamedTemporaryFile(
            delete=False,
            suffix=suffix,
            dir=self.settings.upload_tmp_dir,
        ) as tmp_file:
            content = await upload.read()
            tmp_file.write(content)
            temp_path = Path(tmp_file.name)

        try:
            try:
                platform_number, project_name, pi_name, profiles = self._parse_netcdf(temp_path)
            except NetCDFParsingError as exc:
                logger.exception(
                    "NetCDF parsing failed for upload '%s'.",
                    upload.filename or temp_path.name,
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(exc),
                ) from exc
        finally:
            temp_path.unlink(missing_ok=True)

        self._clear_existing_dataset(db)
        vector_service.reset_store()

        float_record = self._get_or_create_float(
            db=db,
            platform_number=platform_number,
            project_name=project_name,
            pi_name=pi_name,
        )

        profiles_created = 0
        measurements_created = 0
        profile_docs: list[tuple[str, dict[str, str | int | float | None]]] = []

        for parsed_profile in profiles:
            profile = Profile(
                float_id=float_record.id,
                cycle_number=parsed_profile.cycle_number,
                profile_time=parsed_profile.profile_time,
                latitude=parsed_profile.latitude,
                longitude=parsed_profile.longitude,
                source_file=upload.filename or "unknown.nc",
            )
            db.add(profile)
            db.flush()
            profiles_created += 1

            measurement_count = 0
            valid_temperatures = []
            valid_salinities = []
            valid_pressures = []

            for pressure, temperature, salinity in zip(
                parsed_profile.pressures,
                parsed_profile.temperatures,
                parsed_profile.salinities,
                strict=False,
            ):
                measurement = OceanMeasurement(
                    profile_id=profile.id,
                    pressure=pressure,
                    temperature=temperature,
                    salinity=salinity,
                    latitude=parsed_profile.latitude,
                    longitude=parsed_profile.longitude,
                    measured_at=parsed_profile.profile_time,
                )
                db.add(measurement)
                measurements_created += 1
                measurement_count += 1

                if pressure is not None:
                    valid_pressures.append(pressure)
                if temperature is not None:
                    valid_temperatures.append(temperature)
                if salinity is not None:
                    valid_salinities.append(salinity)

            profile_docs.append(
                (
                    self._profile_document(
                        platform_number=platform_number,
                        profile=parsed_profile,
                        measurement_count=measurement_count,
                        valid_pressures=valid_pressures,
                        valid_temperatures=valid_temperatures,
                        valid_salinities=valid_salinities,
                    ),
                    {
                        "float_id": float_record.id,
                        "profile_id": profile.id,
                        "platform_number": platform_number,
                        "cycle_number": parsed_profile.cycle_number,
                        "latitude": parsed_profile.latitude,
                        "longitude": parsed_profile.longitude,
                        "profile_time": (
                            parsed_profile.profile_time.isoformat()
                            if parsed_profile.profile_time
                            else None
                        ),
                    },
                )
            )

        db.commit()

        vector_documents_created = 0
        if profile_docs:
            vector_documents_created = vector_service.add_documents(profile_docs)

        logger.info("Old data cleared, new dataset loaded")

        return NetCDFUploadResponse(
            filename=upload.filename or "unknown.nc",
            float_id=float_record.id,
            profiles_created=profiles_created,
            measurements_created=measurements_created,
            vector_documents_created=vector_documents_created,
        )

    def _clear_existing_dataset(self, db: Session) -> None:
        db.query(OceanMeasurement).delete(synchronize_session=False)
        db.query(Profile).delete(synchronize_session=False)
        db.query(Float).delete(synchronize_session=False)

    def _get_or_create_float(
        self,
        db: Session,
        platform_number: str,
        project_name: str | None,
        pi_name: str | None,
    ) -> Float:
        float_record = db.query(Float).filter(Float.platform_number == platform_number).first()
        if float_record:
            float_record.project_name = project_name or float_record.project_name
            float_record.pi_name = pi_name or float_record.pi_name
            db.flush()
            return float_record

        float_record = Float(
            platform_number=platform_number,
            project_name=project_name,
            pi_name=pi_name,
        )
        db.add(float_record)
        db.flush()
        return float_record

    def _parse_netcdf(
        self,
        file_path: Path,
    ) -> tuple[str, str | None, str | None, list[ParsedProfile]]:
        try:
            dataset_context = self._open_dataset(file_path)
        except NetCDFParsingError:
            raise
        except Exception as exc:
            raise NetCDFParsingError(
                "Failed to read the uploaded NetCDF file. "
                "Please upload a valid ARGO .nc or .nc4 dataset."
            ) from exc

        with dataset_context as dataset:
            platform_number = self._extract_string(dataset, "PLATFORM_NUMBER") or file_path.stem
            project_name = self._extract_string(dataset, "PROJECT_NAME")
            pi_name = self._extract_string(dataset, "PI_NAME")

            cycle_numbers = self._extract_1d(dataset, "CYCLE_NUMBER")
            latitudes = self._extract_1d(dataset, "LATITUDE")
            longitudes = self._extract_1d(dataset, "LONGITUDE")
            times = self._extract_time_values(dataset, "JULD")

            pressures = self._extract_2d(dataset, "PRES")
            temperatures = self._extract_2d(dataset, "TEMP")
            salinities = self._extract_2d(dataset, "PSAL")

            profile_count = max(
                len(cycle_numbers),
                len(latitudes),
                len(longitudes),
                len(times),
                len(pressures),
                len(temperatures),
                len(salinities),
                1,
            )

            profiles: list[ParsedProfile] = []
            for index in range(profile_count):
                pressure_row = pressures[index] if index < len(pressures) else []
                temperature_row = temperatures[index] if index < len(temperatures) else []
                salinity_row = salinities[index] if index < len(salinities) else []

                row_length = max(len(pressure_row), len(temperature_row), len(salinity_row))
                profiles.append(
                    ParsedProfile(
                        cycle_number=self._safe_int(cycle_numbers[index]) if index < len(cycle_numbers) else None,
                        profile_time=times[index] if index < len(times) else None,
                        latitude=self._safe_float(latitudes[index]) if index < len(latitudes) else None,
                        longitude=self._safe_float(longitudes[index]) if index < len(longitudes) else None,
                        pressures=self._pad_row(pressure_row, row_length),
                        temperatures=self._pad_row(temperature_row, row_length),
                        salinities=self._pad_row(salinity_row, row_length),
                    )
                )

        return platform_number, project_name, pi_name, profiles

    def _open_dataset(self, file_path: Path) -> xr.Dataset:
        for engine in ("netcdf4", "h5netcdf", "scipy"):
            try:
                return xr.open_dataset(file_path, engine=engine, decode_cf=True)
            except Exception as exc:
                logger.warning(
                    "Failed to open NetCDF file '%s' with xarray engine '%s': %s",
                    file_path,
                    engine,
                    exc,
                )

        raise NetCDFParsingError(
            "Failed to read the uploaded NetCDF file. "
            "Please upload a valid ARGO .nc or .nc4 dataset."
        )

    def _extract_string(self, dataset: xr.Dataset, variable_name: str) -> str | None:
        if variable_name not in dataset.variables:
            return None

        values = dataset[variable_name].values
        if isinstance(values, np.ndarray) and values.size == 0:
            return None

        if isinstance(values, np.ndarray) and values.ndim > 1:
            first_row = values[0]
            return self._decode_char_row(first_row)

        if isinstance(values, np.ndarray) and values.ndim == 1:
            return self._decode_char_row(values)

        decoded = self._stringify_netcdf_value(values)
        if decoded is None:
            return None
        stripped = decoded.strip()
        return stripped or None

    def _extract_1d(self, dataset: xr.Dataset, variable_name: str) -> list[float | int | None]:
        if variable_name not in dataset.variables:
            return []
        values = np.ma.filled(dataset[variable_name].values, np.nan)
        array = np.atleast_1d(values)
        if array.ndim > 1:
            array = array[:, 0]
        return [self._clean_scalar(item) for item in array.tolist()]

    def _extract_2d(self, dataset: xr.Dataset, variable_name: str) -> list[list[float | None]]:
        if variable_name not in dataset.variables:
            return []

        values = np.ma.filled(dataset[variable_name].values, np.nan)
        array = np.asarray(values)
        if array.ndim == 1:
            array = np.expand_dims(array, axis=0)
        if array.ndim == 0:
            array = np.expand_dims(np.expand_dims(array, axis=0), axis=0)

        rows: list[list[float | None]] = []
        for row in array:
            rows.append([self._safe_float(item) for item in np.asarray(row).tolist()])
        return rows

    def _extract_time_values(self, dataset: xr.Dataset, variable_name: str) -> list[datetime | None]:
        if variable_name not in dataset.variables:
            return []
        values = np.atleast_1d(dataset[variable_name].values)
        if values.ndim > 1:
            values = values[:, 0]
        return [self._normalise_datetime(value) for value in values.tolist()]

    def _normalise_datetime(self, value: object) -> datetime | None:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value if value.tzinfo else value.replace(tzinfo=UTC)
        if isinstance(value, np.datetime64):
            timestamp = value.astype("datetime64[ns]").astype(np.int64) / 1_000_000_000
            return datetime.fromtimestamp(timestamp, tz=UTC)
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return None
            try:
                return datetime.fromisoformat(stripped.replace("Z", "+00:00"))
            except ValueError:
                return None
        if all(hasattr(value, attr) for attr in ("year", "month", "day", "hour", "minute", "second")):
            microsecond = int(getattr(value, "microsecond", 0) or 0)
            try:
                return datetime(
                    int(value.year),
                    int(value.month),
                    int(value.day),
                    int(value.hour),
                    int(value.minute),
                    int(value.second),
                    microsecond,
                    tzinfo=UTC,
                )
            except (TypeError, ValueError):
                return None
        return None

    def _stringify_netcdf_value(self, value: object) -> str | None:
        if value is None:
            return None
        if isinstance(value, (bytes, np.bytes_)):
            return bytes(value).decode("utf-8", errors="ignore")
        if isinstance(value, (str, np.str_)):
            return str(value)
        if isinstance(value, np.ndarray):
            if value.size == 0:
                return None
            if value.ndim == 0:
                return self._stringify_netcdf_value(value.item())
            first_value = value[0]
            if value.ndim == 1:
                joined = "".join(
                    part
                    for part in (
                        self._stringify_netcdf_value(item)
                        for item in value.tolist()
                    )
                    if part is not None
                )
                return joined or None
            return self._stringify_netcdf_value(first_value)
        if isinstance(value, (list, tuple)):
            if not value:
                return None
            if all(isinstance(item, (bytes, np.bytes_, str, np.str_)) for item in value):
                return self._join_string_parts(value)
            return self._stringify_netcdf_value(value[0])
        return str(value)

    def _decode_char_row(self, row: object) -> str | None:
        if isinstance(row, np.ndarray):
            parts = row.tolist()
        elif isinstance(row, (list, tuple)):
            parts = list(row)
        else:
            decoded = self._stringify_netcdf_value(row)
            if decoded is None:
                return None
            stripped = decoded.strip()
            return stripped or None

        decoded_parts = [
            item.decode("utf-8") if isinstance(item, (bytes, np.bytes_)) else str(item)
            for item in parts
        ]
        stripped_parts = [item.strip() for item in decoded_parts if item and item.strip()]
        if not stripped_parts:
            return None

        looks_like_repeated_full_strings = all(len(item) > 1 for item in stripped_parts)
        unique_parts = list(set(stripped_parts))
        unique_parts.sort(key=stripped_parts.index)
        if looks_like_repeated_full_strings and len(unique_parts) < len(stripped_parts):
            return unique_parts[0]

        joined = "".join(decoded_parts).strip()
        return joined or None

    def _pad_row(self, row: list[float | None], length: int) -> list[float | None]:
        if len(row) >= length:
            return row
        return row + [None] * (length - len(row))

    def _clean_scalar(self, value: object) -> float | int | None:
        if value is None:
            return None
        if isinstance(value, (int, np.integer)):
            return int(value)
        if isinstance(value, (float, np.floating)):
            if math.isnan(float(value)):
                return None
            return float(value)
        return None

    def _safe_float(self, value: object) -> float | None:
        cleaned = self._clean_scalar(value)
        if cleaned is None:
            return None
        return float(cleaned)

    def _safe_int(self, value: object) -> int | None:
        cleaned = self._clean_scalar(value)
        if cleaned is None:
            return None
        return int(cleaned)

    def _profile_document(
        self,
        platform_number: str,
        profile: ParsedProfile,
        measurement_count: int,
        valid_pressures: list[float],
        valid_temperatures: list[float],
        valid_salinities: list[float],
    ) -> str:
        profile_time = profile.profile_time.isoformat() if profile.profile_time else "unknown"
        pressure_summary = (
            f"{min(valid_pressures):.2f} to {max(valid_pressures):.2f} dbar"
            if valid_pressures
            else "unknown"
        )
        temperature_summary = (
            f"{min(valid_temperatures):.2f} to {max(valid_temperatures):.2f} C"
            if valid_temperatures
            else "unknown"
        )
        salinity_summary = (
            f"{min(valid_salinities):.2f} to {max(valid_salinities):.2f} PSU"
            if valid_salinities
            else "unknown"
        )

        return (
            f"ARGO float {platform_number} profile summary. "
            f"Cycle number: {profile.cycle_number if profile.cycle_number is not None else 'unknown'}. "
            f"Timestamp: {profile_time}. "
            f"Location: latitude {profile.latitude}, longitude {profile.longitude}. "
            f"Measurements captured: {measurement_count}. "
            f"Pressure range: {pressure_summary}. "
            f"Temperature range: {temperature_summary}. "
            f"Salinity range: {salinity_summary}."
        )


netcdf_ingestion_service = NetCDFIngestionService()
