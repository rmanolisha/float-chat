from pydantic import BaseModel


class NetCDFUploadResponse(BaseModel):
    filename: str
    float_id: int
    profiles_created: int
    measurements_created: int
    vector_documents_created: int
