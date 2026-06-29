from concurrent.futures import ThreadPoolExecutor  
import sys
import os
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from embedder import encode_texts
from vector_store import qdrant_search
from search import extract_authors, extract_abstract, extract_doi

def search_zone(zone_name: str, query_vector: list, num_papers: int):
    start = time.time()
    collection_name = f"research_papers_{zone_name}"
    
    results = qdrant_search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=num_papers
    )
    
    papers = []
    for r in results:
        payload = r.payload
        papers.append({
            "title": payload.get("display_name", "No title"),
            "authors": extract_authors(payload),
            "year": payload.get("publication_year"),
            "abstract": extract_abstract(payload),
            "doi": extract_doi(payload),
            "score": r.score,
            "zone": zone_name
        })
    elapsed = time.time() - start
    print(f"  ⚡ {zone_name.upper()} zone: Searched {num_papers} papers in {elapsed:.2f}s, found {len(papers)} papers")
    return papers

def parallel_search(query: str, zone_weights: dict, total_papers: int = 200):
    """
    Distribute search across zones based on carbon weights.
    Uses threads (better for network I/O on macOS).
    """
    start_total = time.time()
    print(f"\n🚀 PARALLEL SEARCH START")
    print(f"   Query: {query[:50]}...")
    print(f"   Total papers requested: {total_papers}")
    print(f"   Zone weights: {zone_weights}")
    
    # Step 1: Convert query to vector (once)
    query_start = time.time()
    query_vectors = encode_texts([query], convert_to_tensor=False)
    query_vector = query_vectors[0].tolist()
    print(f"   Query encoding: {time.time() - query_start:.2f}s")
    
    # Step 2: Calculate how many papers per zone
    papers_per_zone = {}
    for zone, weight in zone_weights.items():
        papers_per_zone[zone] = int(total_papers * weight)
    print(f"   Papers per zone: {papers_per_zone}")
    
    # Step 3: Run searches in parallel using THREADS
    parallel_start = time.time()
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {}
        for zone, num_papers in papers_per_zone.items():
            if num_papers > 0:
                print(f"   📤 Submitting {zone} zone for {num_papers} papers")
                future = executor.submit(search_zone, zone, query_vector, num_papers)
                futures[zone] = future
        
        # Step 4: Collect results
        all_papers = []
        for zone, future in futures.items():
            try:
                papers = future.result()
                all_papers.extend(papers)
            except Exception as e:
                print(f"   ❌ Error in zone {zone}: {e}")
    parallel_elapsed = time.time() - parallel_start
    print(f"   ⏱️  Parallel search execution: {parallel_elapsed:.2f}s")
    
    # Step 5: Sort by score and return
    sort_start = time.time()
    all_papers.sort(key=lambda x: x["score"], reverse=True)
    print(f"   Sorting: {time.time() - sort_start:.2f}s")
    print(f"   Total papers collected: {len(all_papers)}")
    
    total_elapsed = time.time() - start_total
    print(f"🏁 PARALLEL SEARCH COMPLETE: {total_elapsed:.2f}s total\n")
    return all_papers