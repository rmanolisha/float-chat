from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.ingestion import NetCDFUploadResponse
from app.services.netcdf_service import netcdf_ingestion_service

router = APIRouter(tags=["ingestion"])


@router.post(
    "/upload-netcdf",
    response_model=NetCDFUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_netcdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> NetCDFUploadResponse:
    if not file.filename or not file.filename.lower().endswith((".nc", ".nc4")):
        raise HTTPException(status_code=400, detail="Only NetCDF files are supported.")

    return await netcdf_ingestion_service.ingest_upload(db=db, upload=file)
