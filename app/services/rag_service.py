from __future__ import annotations

from importlib import import_module
from statistics import mean

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import get_settings
from app.models import Profile
from app.schemas.query import QueryRequest, QueryResponse, RetrievedChunk


class RagService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def answer_query(self, db: Session, request: QueryRequest) -> QueryResponse:
        profile = self._latest_profile_with_measurements(db)
        if profile is None:
            return QueryResponse(
                query=request.query,
                answer="No data available",
                retrieved_chunks=[],
            )

        metric = self._requested_metric(request.query)
        retrieved_chunks = self._build_retrieved_chunks(profile, metric)
        if not retrieved_chunks:
            return QueryResponse(
                query=request.query,
                answer="No data available",
                retrieved_chunks=[],
            )

        answer = self._generate_answer(request.query, retrieved_chunks, metric)
        return QueryResponse(
            query=request.query,
            answer=answer,
            retrieved_chunks=retrieved_chunks,
        )

    def _latest_profile_with_measurements(self, db: Session) -> Profile | None:
        stmt = (
            select(Profile)
            .options(joinedload(Profile.float), joinedload(Profile.measurements))
            .order_by(Profile.profile_time.desc().nullslast(), Profile.id.desc())
        )
        profiles = db.scalars(stmt).unique().all()
        for profile in profiles:
            if profile.measurements:
                return profile
        return None

    def _requested_metric(self, query: str) -> str:
        query_lower = query.lower()
        if "salinity" in query_lower or "psal" in query_lower:
            return "salinity"
        if "pressure" in query_lower or "depth" in query_lower or "pres" in query_lower:
            return "pressure"
        return "temperature"

    def _build_retrieved_chunks(self, profile: Profile, metric: str) -> list[RetrievedChunk]:
        measurement_rows: list[str] = []
        metric_values: list[float] = []

        for measurement in sorted(profile.measurements, key=lambda item: item.pressure or 0.0):
            metric_value = getattr(measurement, metric, None)
            pressure_value = measurement.pressure
            if metric_value is None and metric != "pressure":
                continue
            if metric == "pressure" and pressure_value is None:
                continue

            value_to_display = pressure_value if metric == "pressure" else metric_value
            if isinstance(value_to_display, (int, float)):
                metric_values.append(float(value_to_display))

            measurement_rows.append(
                f"pressure={pressure_value}, temperature={measurement.temperature}, salinity={measurement.salinity}"
            )

        if not measurement_rows:
            return []

        summary_content = self._summary_content(profile, metric, metric_values, len(measurement_rows))
        chunks = [
            RetrievedChunk(
                content=summary_content,
                metadata={
                    "profile_id": profile.id,
                    "float_id": profile.float_id,
                    "platform_number": profile.float.platform_number,
                    "cycle_number": profile.cycle_number,
                    "profile_time": profile.profile_time.isoformat() if profile.profile_time else None,
                    "latitude": profile.latitude,
                    "longitude": profile.longitude,
                    "metric": metric,
                },
                score=None,
            )
        ]

        chunks.extend(
            RetrievedChunk(
                content=row,
                metadata={
                    "profile_id": profile.id,
                    "float_id": profile.float_id,
                    "platform_number": profile.float.platform_number,
                    "cycle_number": profile.cycle_number,
                    "metric": metric,
                },
                score=None,
            )
            for row in measurement_rows[: self.settings.rag_top_k * 5]
        )
        return chunks

    def _summary_content(
        self,
        profile: Profile,
        metric: str,
        metric_values: list[float],
        measurement_count: int,
    ) -> str:
        if not metric_values:
            return (
                f"No {metric} measurements are available for float {profile.float.platform_number} "
                f"cycle {profile.cycle_number}."
            )

        unit = {
            "temperature": "C",
            "salinity": "PSU",
            "pressure": "dbar",
        }[metric]
        return (
            f"Latest uploaded profile for float {profile.float.platform_number}, cycle "
            f"{profile.cycle_number if profile.cycle_number is not None else 'unknown'}, "
            f"contains {measurement_count} measurements. "
            f"{metric.title()} range: {min(metric_values):.2f} to {max(metric_values):.2f} {unit}. "
            f"Average {metric}: {mean(metric_values):.2f} {unit}. "
            f"Location: latitude {profile.latitude}, longitude {profile.longitude}."
        )

    def _generate_answer(
        self,
        query: str,
        chunks: list[RetrievedChunk],
        metric: str,
    ) -> str:
        deterministic_answer = self._deterministic_answer(metric, chunks)
        if not self.settings.openai_api_key:
            return deterministic_answer

        try:
            openai_module = import_module("langchain_openai")
            messages_module = import_module("langchain_core.messages")
        except ImportError as exc:
            return deterministic_answer

        try:
            llm = openai_module.ChatOpenAI(
                api_key=self.settings.openai_api_key,
                model="gpt-4o-mini",
                temperature=0.1,
            )
            context = "\n\n".join(
                f"Chunk {index + 1}:\n{chunk.content}\nMetadata: {chunk.metadata}"
                for index, chunk in enumerate(chunks)
            )
            response = llm.invoke(
                [
                    messages_module.SystemMessage(
                        content=(
                            "You are an ocean data assistant. Explain only the supplied PostgreSQL-backed "
                            "measurement context. Do not add generic oceanography knowledge or unsupported claims."
                        )
                    ),
                    messages_module.HumanMessage(
                        content=(
                            f"Question: {query}\n\n"
                            f"Retrieved context:\n{context}\n\n"
                            "Answer briefly using the dataset only."
                        )
                    ),
                ]
            )
            return response.content if isinstance(response.content, str) else str(response.content)
        except Exception:
            return deterministic_answer

    def _deterministic_answer(self, metric: str, chunks: list[RetrievedChunk]) -> str:
        summary = chunks[0].content if chunks else "No data available"
        sample_rows = [chunk.content for chunk in chunks[1:6]]
        if not sample_rows:
            return summary
        return (
            f"{summary}\n"
            f"Sample {metric} profile points from the latest uploaded dataset: "
            + "; ".join(sample_rows)
        )


rag_service = RagService()
