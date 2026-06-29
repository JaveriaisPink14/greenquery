#Mapping: centralizes constants (replaces in-notebook literal strings like model name, file paths, qdrant url/key).

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Model
SBERT_MODEL_NAME = os.getenv("SBERT_MODEL_NAME", "all-MiniLM-L6-v2")

# Paths (adjust relative paths if you place data elsewhere)
DATA_PKL_PATH = os.getenv("DATA_PKL_PATH", "df_cleaned.pkl")
EMBEDDINGS_PT_PATH = os.getenv("EMBEDDINGS_PT_PATH", "paper_embeddings.pt")

# Qdrant configuration (must be set in environment; DO NOT hardcode secrets)
QDRANT_URL = os.getenv("QDRANT_URL", None)
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", None)
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "research_papers")

# Upsert batching
UPSERT_BATCH_SIZE = int(os.getenv("UPSERT_BATCH_SIZE", 16))

# Default search top-k
TOP_K_DEFAULT = int(os.getenv("TOP_K_DEFAULT", 5))














