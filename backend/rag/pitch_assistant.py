import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def evaluate_pitch(job_title: str, job_description: str, student_pitch: str):
    """
    Evaluates a student's pitch against the job requirements and returns 
    structured JSON feedback for the frontend dashboard.
    """
    
    prompt = f"""
    You are an expert career coach for a freelance marketplace.
    A student is applying for the following job:
    Job Title: {job_title}
    Job Description: {job_description}
    
    The student has written this draft pitch:
    "{student_pitch}"
    
    Analyze this pitch. Is it high effort or low effort? 
    Provide actionable feedback on how to improve the copy, what portfolio assets to include, and timeline/price optimization.
    """
    
    # We use response_schema to force Gemini to return a perfect JSON object
    # This makes it infinitely easier for your React/Next.js frontend to render!
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "OBJECT",
                "properties": {
                    "is_ready_to_send": {"type": "BOOLEAN", "description": "True if the pitch is great, False if it needs work"},
                    "score_out_of_10": {"type": "INTEGER"},
                    "critique": {"type": "STRING", "description": "A polite but firm explanation of what is wrong with the current pitch"},
                    "suggested_rewrite": {"type": "STRING", "description": "A highly professional, optimized version of their pitch"},
                    "missing_assets_to_add": {
                        "type": "ARRAY", 
                        "items": {"type": "STRING"},
                        "description": "Specific portfolio items or links they should include based on the job description"
                    }
                },
                "required": ["is_ready_to_send", "score_out_of_10", "critique", "suggested_rewrite", "missing_assets_to_add"]
            }
        )
    )
    
    return response.text