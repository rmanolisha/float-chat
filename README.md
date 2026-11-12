# 🌊 FloatChat – AI-Powered Conversational Interface for ARGO Ocean Data Discovery and Visualization

**Making Ocean Data Accessible Through Artificial Intelligence**

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![AI](https://img.shields.io/badge/AI-LLM%20%7C%20RAG-purple)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

## 📌 Overview

FloatChat is an AI-powered conversational platform designed to simplify the discovery, exploration, and visualization of oceanographic data collected through the **ARGO Global Ocean Observing System**.

ARGO floats continuously collect essential oceanographic parameters such as temperature, salinity, pressure, and biogeochemical measurements. However, accessing and analyzing this information often requires technical expertise and familiarity with scientific data formats such as NetCDF.

FloatChat addresses this challenge by introducing a natural language interface that allows researchers, students, and ocean enthusiasts to interact with complex ARGO datasets through simple conversational queries.

By integrating Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), structured databases, and interactive visualizations, FloatChat aims to transform raw oceanographic data into meaningful and accessible insights.

## 🎯 Problem Statement

Oceanographic datasets are large, complex, and stored in specialized scientific formats such as NetCDF. Extracting meaningful insights requires domain knowledge, programming skills, and experience with scientific data analysis tools.

Traditional approaches make it difficult for non-technical users to discover, filter, compare, and visualize oceanographic observations.

There is a need for an intelligent conversational system that enables users to explore oceanographic datasets using natural language while providing accurate data-driven responses and interactive visualizations.

## 💡 Proposed Solution

FloatChat provides an intelligent interface that connects natural language queries with structured oceanographic datasets.

Users can ask questions in everyday language, and the system interprets their intent, retrieves relevant ARGO observations, executes appropriate data queries, and presents the results through interactive charts, maps, and conversational explanations.

## ✨ Key Features

### 1. Natural Language Ocean Data Querying
- Ask questions using simple English.
- Identify oceanographic parameters, locations, dates, and depth ranges.
- Convert natural language requests into structured database queries.

### 2. ARGO NetCDF Data Processing
- Ingest scientific NetCDF files.
- Extract temperature, salinity, pressure, location, and time information.
- Clean, preprocess, and transform raw observations into structured datasets.

### 3. AI-Powered Conversational Interface
- LLM-based query understanding.
- Context-aware conversations.
- Retrieval-Augmented Generation (RAG).
- Relevant follow-up question suggestions.

### 4. Intelligent Data Retrieval
- PostgreSQL for structured oceanographic observations.
- FAISS/ChromaDB for semantic metadata retrieval.
- MCP-based integration for connecting AI systems with data tools.

### 5. Interactive Ocean Visualization
- Geospatial ARGO float locations.
- Temperature and salinity depth profiles.
- Depth-time visualizations.
- Comparison of multiple float observations.
- Interactive charts and maps.

### 6. Advanced Analytical Capabilities (Planned)
- Oceanographic anomaly detection.
- Historical temperature and salinity trend analysis.
- Nearest ARGO float discovery.
- Biogeochemical parameter exploration.
- Predictive ocean trend analysis.

## 🏗️ System Architecture

```text
             USER
               |
               v
       Next.js Chat Interface
               |
               v
        FastAPI Backend
               |
               v
       AI Query Understanding
               |
        +------+------+
        |             |
        v             v
      LLM          MCP Tools
        |             |
        +------+------+
               |
               v
        RAG Pipeline
               |
        +------+------+
        |             |
        v             v
   PostgreSQL      FAISS /
   Ocean Data      ChromaDB
        |
        v
  Query Execution
        |
        v
  Data Processing
        |
        v
 Interactive Visualization
        |
        v
  Maps / Charts / Insights
```

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Programming Language | Python 3.11 |
| Frontend | Next.js, React, TypeScript |
| UI Styling | Tailwind CSS |
| Backend | FastAPI |
| Scientific Data Processing | Xarray, NetCDF4, NumPy, Pandas |
| Relational Database | PostgreSQL |
| Vector Database | FAISS / ChromaDB |
| AI Integration | LLMs, RAG |
| Tool Integration | Model Context Protocol (MCP) |
| Visualization | Recharts, Plotly, Leaflet |
| API Communication | REST API |

## 📊 Example User Queries

Users will be able to interact with FloatChat through questions such as:

- "Show me temperature profiles in the Indian Ocean."
- "Display salinity measurements near the equator in March 2023."
- "Compare temperature variations at different ocean depths."
- "Find the nearest ARGO floats to a given location."
- "Show biogeochemical observations in the Arabian Sea."
- "Identify unusual temperature variations in the selected region."

## 📂 Project Structure

```text
FloatChat/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── ingestion/
│   │   ├── preprocessing/
│   │   ├── database/
│   │   ├── ai_engine/
│   │   ├── rag/
│   │   ├── mcp/
│   │   └── visualization/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── public/
│   └── package.json
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── sample/
│
├── notebooks/
│   └── data_exploration.ipynb
│
├── docs/
│   ├── architecture.md
│   └── methodology.md
│
├── README.md
└── .gitignore
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.11
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/FloatChat.git

cd FloatChat
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux / macOS:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open the application:

```text
http://localhost:3000
```

*Note: These commands describe the planned setup and will work once the corresponding application files and configuration are implemented.*

## 🌍 Dataset

FloatChat initially focuses on ARGO oceanographic datasets, particularly observations from the Indian Ocean region.

**Data Source:**

- [ARGO Global Data Assembly Centres](https://argo.ucsd.edu/data/)
- [ARGO GDAC FTP/Data Access](https://www.argodatamgt.org/Access-to-data/Argo-data-access)

**Dataset Parameters:**
- Temperature
- Salinity
- Pressure
- Latitude and Longitude
- Observation Time
- Biogeochemical (BGC) Parameters

The system is designed to support future integration with additional oceanographic data sources.

## 🔬 Research Potential and Innovation

FloatChat aims to improve accessibility and usability of scientific oceanographic datasets through the following contributions:

1. **Conversational Data Discovery:** Natural language interaction with complex scientific datasets.
2. **Hybrid Retrieval Architecture:** Combining structured SQL queries with semantic retrieval.
3. **AI-Assisted Oceanographic Analysis:** Context-aware explanations based on retrieved observations.
4. **Interactive Geospatial Exploration:** Connecting conversational queries with location-based scientific visualizations.
5. **Extensible Data Framework:** Designed for future integration with BGC floats, underwater gliders, buoys, and satellite observations.

## 🚀 Future Enhancements

- Predictive ocean temperature and salinity analysis.
- Automated oceanographic anomaly detection.
- Multi-source ocean data integration.
- Advanced BGC parameter analysis.
- Research-oriented report generation.
- Multilingual conversational support.
- Real-time dataset synchronization.

## 🎯 Expected Impact

FloatChat aims to bridge the gap between complex scientific oceanographic datasets and everyday users.

It can support:

- Oceanographic researchers.
- Marine scientists.
- Climate researchers.
- Students and academic institutions.
- Environmental monitoring organizations.
- Data analysts and decision-makers.

## 👩‍💻 Project Information

**Project Name:** FloatChat

**Category:** Artificial Intelligence | Oceanography | Data Science

**Project Type:** Conversational AI and Scientific Data Visualization

**Primary Domain:** Oceanographic Data Analysis

**Development Status:** In Development

---

**FloatChat – Making Ocean Data Conversational, Intelligent, and Accessible.** 🌊
