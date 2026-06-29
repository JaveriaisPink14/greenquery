from search import search_papers

# Search for papers
query = "transformer attention mechanisms"
papers = search_papers(query, top_k=3)

print(f"\n🔍 Results for: '{query}'\n")
print(f"Found {len(papers)} papers\n")

for i, paper in enumerate(papers, 1):
    print(f"{i}. {paper['title']}")
    print(f"   Authors: {paper['authors']}")
    print(f"   Year: {paper['year']}")
    print(f"   Relevance: {paper['relevance']}")
    print(f"   Abstract: {paper['abstract'][:150]}...")
    print()
