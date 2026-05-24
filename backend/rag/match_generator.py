import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Initialize the new SDK client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_match_analysis(student_criteria: str, retrieved_jobs: list):
    """
    Synthesizes the retrieved jobs and student criteria into a personalized response.
    """
    
    # 1. Format the retrieved context for the LLM
    job_context = "\n\n".join([
        f"Job ID: {job['id']}\nTitle: {job['title']}\nDescription: {job.get('description', 'No description provided.')}"
        for job in retrieved_jobs
    ])
    
    # 2. Build the RAG Prompt
    # We explicitly instruct the model to use ONLY the provided job context
    prompt = f"""
    You are an expert Talent Matching AI. 
    A student is searching for work with these criteria: "{student_criteria}"
    
    Here are the top job listings retrieved from our database:
    {job_context}
    
    Your task:
    1. Analyze these jobs and explain to the student why they are a good match.
    2. Highlight specific skills from the jobs that align with the student's criteria.
    3. If the jobs don't perfectly match, be honest and suggest what the student might be missing.
    
    Maintain a professional, encouraging tone.
    """
    
    # 3. Call Gemini using the latest genai SDK
    response = client.models.generate_content(
        model="gemini-1.5-flash", # Flash is fastest and cheapest for RAG
        contents=prompt,
    )
    
    return response.text

# --- Example Usage (How your backend calls this) ---
if __name__ == "__main__":
    # This simulates receiving results from search_engine.py
    simulated_jobs = [
        {"id": "1", "title": "Social Media Designer", "description": "Needs Figma and Reel editing skills."}
    ]
    
    analysis = generate_match_analysis("I want social media design work", simulated_jobs)
    print(analysis)