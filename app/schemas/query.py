from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3)
    top_k: int = Field(default=4, ge=1, le=10)


class RetrievedChunk(BaseModel):
    content: str
    metadata: dict[str, str | int | float | None]
    score: float | None = None


class QueryResponse(BaseModel):
    query: str
    answer: str
    retrieved_chunks: list[RetrievedChunk]
