from embedder import encode_texts
from vector_store import qdrant_search
from config import QDRANT_COLLECTION

def search_papers(query: str, top_k: int = 10):
    """
    Simple search function for GreenScholar.
    Returns list of papers with title, authors, year, abstract, score.
    """
    # Step 1: Convert query to vector
    query_vector = encode_texts([query], convert_to_tensor=False)
    
    # Step 2: Search Qdrant
    results = qdrant_search(
        collection_name=QDRANT_COLLECTION,
        query_vector=query_vector[0].tolist(),
        limit=top_k
    )
    
    # Step 3: Format results
    papers = []
    for r in results:
        payload = r.payload
        papers.append({
            "title": payload.get("display_name", "No title"),
            "authors": extract_authors(payload),
            "year": payload.get("publication_year"),
            "abstract": extract_abstract(payload),
            "doi": extract_doi(payload), 
            "relevance": round(r.score, 3),
            "openalex_id": payload.get("id")
        })
    
    return papers

def extract_authors(payload):
    authorships = payload.get("authorships", [])
    if authorships:
        authors = []
        for a in authorships[:3]:
            author = a.get("author", {})
            name = author.get("display_name", "")
            if name:
                authors.append(name)
        return ", ".join(authors)
    return "Unknown"

def extract_abstract(payload):
    # Try direct abstract first
    abstract = payload.get("abstract")
    if abstract:
        return abstract[:300] + "..."
    
    # Try inverted index
    abstract_inverted = payload.get("abstract_inverted_index")
    if abstract_inverted:
        words = list(abstract_inverted.keys())
        return " ".join(words[:50]) + "..."
    
    return "Abstract not available"

def extract_doi(payload):
    """Extract DOI from paper payload"""
    doi = payload.get("doi")
    if doi:
        return doi
    # Try from ids field
    ids = payload.get("ids", {})
    return ids.get("doi", None)
