import os
from google import genai
from google.genai import types
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables (SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY)
load_dotenv()

# Initialize Clients
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def generate_embedding(text: str):
    """Generates a 768-dim embedding using text-embedding-004."""
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=768)
    )
    # The first (and only) embedding object's vector
    return response.embeddings[0].values

def update_job_embeddings():
    # 1. Fetch jobs that don't have an embedding yet
    response = supabase.table("jobs").select("id, title, prompt_text").is_("embedding", "null").execute()
    jobs = response.data
    
    if not jobs:
        print("No new jobs to embed.")
        return

    print(f"Embedding {len(jobs)} jobs...")

    for job in jobs:
        # Combine title and prompt for richer semantic context
        combined_text = f"Title: {job['title']}. Description: {job['prompt_text']}"
        
        try:
            # 2. Generate Embedding
            embedding = generate_embedding(combined_text)
            
            # 3. Update Supabase
            supabase.table("jobs").update({"embedding": embedding}).eq("id", job["id"]).execute()
            print(f"Successfully embedded: {job['title']}")
            
        except Exception as e:
            print(f"Failed to embed job {job['id']}: {e}")

if __name__ == "__main__":
    update_job_embeddings()