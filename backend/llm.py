from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

_groq_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=_groq_key) if _groq_key else None


def summarize_papers(query: str, papers: list) -> str:
    if client is None:
        return "AI summary unavailable (GROQ_API_KEY not set)."

    """
    Summarize top 3 papers using Groq (free, fast).
    """
    if not papers:
        return "No papers to summarize."
    
    # Prepare paper texts
    paper_texts = []
    for i, paper in enumerate(papers[:3], 1):
        paper_texts.append(f"""
Paper {i}:
Title: {paper.get('title', 'Unknown')}
Year: {paper.get('year', 'Unknown')}
Abstract: {paper.get('abstract', 'Abstract not available')[:400]}
""")
    
    prompt = f"""
You searched for: "{query}"

Here are the top 3 relevant papers:
{chr(10).join(paper_texts)}

Write a 2-paragraph summary:
- First paragraph: What these papers collectively find
- Second paragraph: How they relate to the user's query

Keep it concise, 4-5 sentences total.
"""
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI summary temporarily unavailable. ({str(e)[:50]}...)"


def evaluate_routing(query: str, mode: str, speedup: float, zone_counts: dict, zone_weights: dict) -> str:
    if client is None:
        return f"AI evaluation unavailable (GROQ_API_KEY not set). Your mode was {mode} with {speedup}x speedup." 

    """
    Evaluate whether the user's routing choice was optimal.
    """
    # Handle Run Now mode differently (speed priority, not carbon)
    if mode == "run-now":
        prompt = f"""
You searched for: "{query}"
You chose mode: "Run Now" (prioritizes SPEED over carbon savings)

Results:
- Speedup: {speedup}x faster than sequential
- Zone distribution in results: {zone_counts}
- Intended weights (equal distribution): {zone_weights}

Write 2 sentences:
1. Acknowledge they chose speed over carbon savings (this was intentional)
2. Suggest that if they want to save carbon next time, they should select Run Green or Balanced mode

Keep it very short and helpful.
"""
    else:
        prompt = f"""
You searched for: "{query}"
You chose mode: "{mode}" (prioritizes CARBON SAVINGS)

Results:
- Speedup: {speedup}x faster than sequential
- Zone distribution in results: {zone_counts}
- Intended weights: {zone_weights}

Write 2 sentences:
1. Was your choice optimal for carbon savings?
2. What should you do next time to save even more carbon?

Keep it very short and helpful.
"""
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=150
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI evaluation unavailable. Your {mode} mode achieved {speedup}x speedup with distribution {zone_counts}."