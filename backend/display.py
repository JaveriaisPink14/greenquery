"""
Paper display utilities for GreenScholar.
Extracted from your original project but simplified.
"""

def extract_authors(payload):
    """Extract author names from paper payload"""
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
    """Extract abstract text from paper payload"""
    # Try direct abstract first
    abstract = payload.get("abstract")
    if abstract:
        return abstract[:400] + "..."
    
    # Try inverted index (your old format)
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

def extract_year(payload):
    """Extract publication year"""
    return payload.get("publication_year", "Unknown")

def format_paper_for_response(payload, score, zone_name):
    """
    Convert a Qdrant paper payload into a clean response dict.
    Use this instead of manually building dicts everywhere.
    """
    return {
        "title": payload.get("display_name", "No title"),
        "authors": extract_authors(payload),
        "year": extract_year(payload),
        "abstract": extract_abstract(payload),
        "doi": extract_doi(payload),
        "score": round(score, 4),
        "zone": zone_name
    }