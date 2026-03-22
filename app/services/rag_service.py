from __future__ import annotations

from importlib import import_module

from app.core.config import get_settings
from app.schemas.query import QueryRequest, QueryResponse, RetrievedChunk
from app.services.vector_service import vector_service


class RagService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def answer_query(self, request: QueryRequest) -> QueryResponse:
        matches = vector_service.similarity_search(request.query, request.top_k)
        if not matches:
            raise ValueError("No vectorized float profiles are available. Upload a NetCDF file first.")

        retrieved_chunks = [
            RetrievedChunk(
                content=document.page_content,
                metadata=document.metadata,
                score=float(score) if score is not None else None,
            )
            for document, score in matches
            if not document.metadata.get("seed")
        ]

        if not retrieved_chunks:
            raise ValueError("No ARGO profile data is indexed yet. Upload a NetCDF file first.")

        answer = self._generate_answer(request.query, retrieved_chunks)
        return QueryResponse(
            query=request.query,
            answer=answer,
            retrieved_chunks=retrieved_chunks,
        )

    def _generate_answer(self, query: str, chunks: list[RetrievedChunk]) -> str:
        if not self.settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required for the RAG query endpoint.")

        try:
            openai_module = import_module("langchain_openai")
            messages_module = import_module("langchain_core.messages")
        except ImportError as exc:
            raise ValueError(
                "The RAG query endpoint is unavailable because optional OpenAI dependencies are not installed."
            ) from exc

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
                        "You are an ocean data assistant. Answer using only the retrieved ARGO profile "
                        "context. If the answer is uncertain, say so clearly."
                    )
                ),
                messages_module.HumanMessage(
                    content=(
                        f"Question: {query}\n\n"
                        f"Retrieved context:\n{context}\n\n"
                        "Provide a concise analytical answer."
                    )
                ),
            ]
        )
        return response.content if isinstance(response.content, str) else str(response.content)


rag_service = RagService()
