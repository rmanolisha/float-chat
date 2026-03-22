# FloatChatAI Backend

Backend API for ingesting ARGO NetCDF files, persisting structured ocean observations in PostgreSQL, indexing profile summaries in FAISS, and answering natural-language questions with a LangChain RAG pipeline.

## Structure

```text
app/
  core/
  models/
  routes/
  schemas/
  services/
```

## Run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

## Required Environment Variables

- `DATABASE_URL`
- `OPENAI_API_KEY`

## Endpoints

- `POST /upload-netcdf`
- `POST /query`
- `GET /floats`
- `GET /profiles`
