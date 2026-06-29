# corresponds to your Qdrant connection, creation of indexes, and batch upsert + search. I added safe exceptions for index creation.
# Important: this module expects env vars rather than hardcoding the API key.

from qdrant_client import QdrantClient
from qdrant_client.http import models as rest
import os
from typing import List, Dict, Any, Optional

_client: Optional[QdrantClient] = None

def get_qdrant_client():
    """
    Create/return a Qdrant client from env vars (do NOT hardcode API keys).
    """
    global _client
    if _client is None:
        from config import QDRANT_URL, QDRANT_API_KEY
        if not QDRANT_URL or not QDRANT_API_KEY:
            raise EnvironmentError("QDRANT_URL and QDRANT_API_KEY must be set as environment variables.")
        _client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=300)
    return _client

def upsert_embeddings(collection_name: str, points: List[Dict[str, Any]], batch_size: int = 16):
    """
    Upsert points in batches. Each point is {"id": int, "vector": list[float], "payload": dict}.
    Mirrors your notebook batch upsert.
    """
    client = get_qdrant_client()
    for i in range(0, len(points), batch_size):
        batch = points[i:i+batch_size]
        client.upsert(collection_name=collection_name, points=batch)

def create_payload_indexes(collection_name: str, index_fields: Dict[str, str]):
    """
    Create payload indexes in Qdrant similar to notebook's create_payload_index calls.
    index_fields maps field_name -> dtype string ("keyword","integer","bool",...)
    """
    client = get_qdrant_client()
    for field, dtype in index_fields.items():
        try:
            client.create_payload_index(collection_name=collection_name, field_name=field, field_schema=rest.PayloadSchemaType(dtype))
        except Exception as e:
            # index may already exist or Qdrant may raise — surface as warning
            print(f"Warning: could not create index for {field} ({dtype}): {e}")

def qdrant_search(collection_name: str, query_vector: List[float], limit: int = 5, with_payload: bool = True, with_vectors: bool = True, filter=None):
    """
    Run a vector search on Qdrant using query_points (works with qdrant-client 1.18.0)
    """
    client = get_qdrant_client()
    
    # Use query_points instead of search for version 1.18.0 compatibility
    results = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        limit=limit,
        with_payload=with_payload
    )
    
    # query_points returns an object with .points attribute
    return results.points
