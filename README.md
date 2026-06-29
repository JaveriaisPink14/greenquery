# Green Query - Carbon-Aware Research Paper Discovery Platform

##  Overview

**Green Query** is a web-based research paper discovery platform that helps academics and researchers find relevant scholarly papers while making carbon-aware decisions visible. The application integrates real-time grid carbon intensity data, allowing users to choose between speed and environmental impact when searching academic literature.

Inspired by Google's 2021 paper "Carbon-Aware Computing for Datacenters," which demonstrated that shifting flexible workloads to greener times can reduce emissions by up to 50%, Green Query brings this transparency to user-facing applications.

##  Features

- **Live Carbon Scores Grid Monitoring** - Real-time visualization of carbon intensity across different zones
- **Semantic Search** - Through embeddings stored in a vector database of academic papers
- **AI-Powered Summarization** - Using Groq's Llama 3.3 70B model
- **Routing Decision Evaluation** - Carbon impact reports for each search query
- **Carbon Forecast** - Predictive analytics showing when each zone reaches its next peak carbon score
- **Dual Mode Search** - Choose between "Run Now" (speed-optimized) and "Run Green" (carbon-optimized)

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite, CSS-in-JS |
| Backend | FastAPI (Python) |
| Database | Qdrant (Vector DB) + SQLite (User DB) |
| AI Integration | Groq API (Llama 3.3 70B) |
| Real-time Communication | Server-Sent Events (SSE) |
| Authentication | bcrypt password hashing |

##  Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (React + Vite)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │   Search UI  │  │Carbon Grid  │  │   Insights Dashboard   ││
│  └─────────────┘  └─────────────┘  └─────────────────────────┘│
│         │               │                      │                │
│         └───────────────┼──────────────────────┘                │
│                         │ SSE                                   │
├─────────────────────────┼───────────────────────────────────────┤
│                         ▼                                       │
│                  ┌─────────────┐                               │
│                  │  FastAPI    │                               │
│                  │  Backend    │                               │
│                  └──────┬──────┘                               │
│                         │                                       │
│         ┌───────────────┼───────────────┐                     │
│         ▼               ▼               ▼                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │   Qdrant    │ │   SQLite    │ │   Groq API          │    │
│  │ (Vector DB) │ │ (User DB)   │ │ (Llama 3.3 70B)    │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```
## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API Key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/green-query.git
cd green-query/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your Groq API key and database configurations

# Run the FastAPI server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./green_query.db
QDRANT_URL=http://localhost:6333
SECRET_KEY=your_secret_key_here
```

##  Database Schema

### User Database (SQLite)
- `users` - User authentication and preferences
- `search_history` - Historical search records
- `carbon_metrics` - Stored carbon intensity data

### Vector Database (Qdrant)
- Collection: `research_papers`
- Dimensions: 768 (sentence-transformers embeddings)
- Metadata: Title, authors, abstract, publication date, DOI

## 🔌 API Endpoints

### Web APIs
- `GET /api/carbon/intensity` - Get current carbon scores
- `POST /api/search` - Perform semantic search with mode selection
- `GET /api/forecast` - Get carbon intensity predictions
- `GET /api/insights/{search_id}` - Get detailed carbon report

### LLM Integration
- `POST /api/summarize` - Generate paper summaries using Llama 3.3
- `POST /api/analyze/carbon` - Analyze carbon impact of routing decisions

## 📚 Research Foundation

This project is built upon foundational research in carbon-aware computing:

> **Google's 2021 Paper**: "Carbon-Aware Computing for Datacenters" demonstrated that shifting flexible workloads to greener times can reduce emissions by up to 50%.

> **Microsoft's Integration**: Azure's scheduler has integrated carbon-awareness, proving the viability of this approach in production environments.

Green Query extends this research to user-facing applications, making carbon-conscious decisions transparent and actionable for researchers.

##  Acknowledgments

- Google for their pioneering research in carbon-aware computing
- Groq for providing LLM API access
- Qdrant for vector database solutions

---

