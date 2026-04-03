from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.query import QueryRequest, QueryResponse
from app.services.rag_service import rag_service

router = APIRouter(tags=["query"])


@router.post("/query", response_model=QueryResponse, status_code=status.HTTP_200_OK)
def query_data(
    request: QueryRequest,
    db: Session = Depends(get_db),
) -> QueryResponse:
    try:
        return rag_service.answer_query(db, request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
