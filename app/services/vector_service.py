from __future__ import annotations

import logging
from importlib import import_module
from pathlib import Path
import shutil
from typing import TYPE_CHECKING, Any

from app.core.config import get_settings

if TYPE_CHECKING:
    from langchain_core.documents import Document

logger = logging.getLogger(__name__)


class VectorService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._store: Any | None = None
        self._dependency_error: str | None = None

    def _load_vector_dependencies(self) -> tuple[type[Any], type[Any], type["Document"]]:
        try:
            faiss_module = import_module("langchain_community.vectorstores")
            openai_module = import_module("langchain_openai")
            documents_module = import_module("langchain_core.documents")
        except ImportError as exc:
            self._dependency_error = (
                "Vector search is unavailable because optional AI dependencies are not installed."
            )
            raise ValueError(self._dependency_error) from exc

        return (
            faiss_module.FAISS,
            openai_module.OpenAIEmbeddings,
            documents_module.Document,
        )

    def _embeddings(self) -> Any:
        if not self.settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required for embedding generation and querying.")
        _, openai_embeddings_cls, _ = self._load_vector_dependencies()
        return openai_embeddings_cls(api_key=self.settings.openai_api_key)

    def ensure_store(self) -> Any | None:
        if self._store is not None:
            return self._store

        if not self.settings.openai_api_key:
            return None

        faiss_cls, _, _ = self._load_vector_dependencies()
        index_path = Path(self.settings.vector_index_path)

        if (index_path / "index.faiss").exists() and (index_path / "index.pkl").exists():
            self._store = faiss_cls.load_local(
                folder_path=str(index_path),
                embeddings=self._embeddings(),
                allow_dangerous_deserialization=True,
            )
            return self._store

        return None

    def reset_store(self) -> None:
        index_path = Path(self.settings.vector_index_path)
        self._store = None

        if index_path.exists():
            shutil.rmtree(index_path, ignore_errors=True)

        logger.info("Vector store cleared for fresh dataset load.")

    def add_documents(self, document_payloads: list[tuple[str, dict[str, str | int | float | None]]]) -> int:
        if not document_payloads:
            return 0

        try:
            store = self.ensure_store()
        except ValueError:
            return 0
        except Exception:
            logger.exception("Vector store initialization failed during NetCDF ingestion.")
            return 0

        faiss_cls, _, document_cls = self._load_vector_dependencies()
        documents = [
            document_cls(page_content=content, metadata=metadata)
            for content, metadata in document_payloads
        ]
        try:
            if store is None:
                index_path = Path(self.settings.vector_index_path)
                index_path.mkdir(parents=True, exist_ok=True)
                store = faiss_cls.from_documents(
                    documents=documents,
                    embedding=self._embeddings(),
                )
                self._store = store
            else:
                store.add_documents(documents)

            store.save_local(str(self.settings.vector_index_path))
        except Exception:
            logger.exception("Vector document indexing failed during NetCDF ingestion.")
            return 0

        return len(documents)

    def similarity_search(self, query: str, top_k: int) -> list[tuple["Document", float]]:
        try:
            store = self.ensure_store()
        except ValueError as exc:
            raise ValueError(str(exc)) from exc

        if store is None:
            raise ValueError(
                "No vectorized dataset is available. Upload a NetCDF file first."
            )
        return store.similarity_search_with_score(query, k=top_k)


vector_service = VectorService()
