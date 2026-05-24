import os
from google import genai
from google.genai import types # Add this import
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def find_matching_jobs(student_criteria: str, match_threshold: float = 0.5, limit: int = 5):
    """
    1. Embeds student criteria using the new model.
    2. Queries Supabase using the 'match_jobs_rag' RPC function.
    """
    
    # 1. Convert student criteria into a 768-dim vector
    response = client.models.embed_content(
        model="gemini-embedding-001", # Updated Model Name
        contents=student_criteria,
        config=types.EmbedContentConfig(output_dimensionality=768) # Force 768 dimensions
    )
    query_embedding = response.embeddings[0].values
    
    # 2. Call the Supabase RPC function
    matches = supabase.rpc("match_jobs_rag", {
        "query_embedding": query_embedding,
        "match_threshold": match_threshold,
        "match_count": limit
    }).execute()
    
    return matches.data

if __name__ == "__main__":
    criteria = "I am a designer looking for social media work under 5 hours a week."
    results = find_matching_jobs(criteria)
    
    print(f"Found {len(results)} matches for your criteria:")
    for job in results:
        print(f"Title: {job['title']} (Score: {job['similarity']:.2f})")