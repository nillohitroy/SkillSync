# 🚀 SkillSync: The AI-Powered Hyperlocal Freelance Marketplace

SkillSync is a two-sided, hyper-local marketplace that bridges the gap between verified SMEs (Small and Medium Enterprises) and skilled local student talent. 

Powered by Next.js, FastAPI, and an intelligent **RAG (Retrieval-Augmented Generation) pipeline using Gemini and Supabase pgvector**, SkillSync acts as an automated project manager, recruiter, and escrow agent all in one platform.

---

## 🌟 Key Features

### 💼 For Businesses (SMEs)
* **AI-Assisted Task Creation:** Post jobs with specific deliverables, budgets, and deadlines.
* **Cron-based Automations:** Automatically trigger recurring workflows (e.g., "Design 3 social posts every week") via the Automation Engine.
* **Smart Escrow Pipeline:** Funds are securely locked in a smart pipeline and only released upon digital sign-off, ensuring trust.
* **Dashboard Analytics:** Track active volume, awaiting sign-offs, and active executions at a glance.
* **Stripe Integration:** Seamlessly manage billing, invoices, and payment methods via the Stripe Customer Portal.

### 🎓 For Students (Talent)
* **Semantic Semantic Search (RAG):** Tell the AI what you want (e.g., *"Looking for quick design tasks under $500"*), and the RAG pipeline will instantly return the most relevant semantic matches.
* **AI Pitch Assistant:** Get real-time, actionable feedback from the AI on your pitch draft before submitting it to a business.
* **Trust Tiers:** Build reputation through completed tasks to unlock higher-tier jobs and faster payouts.
* **Hyperlocal Feed:** Browse the open market feed to find local tasks that match your specific skill set.

---

## 🏗️ Architecture & Tech Stack

SkillSync is built on a modern, decoupled architecture ensuring scalability and speed.

**Frontend:**
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Anime.js for buttery-smooth UI transitions

**Backend:**
* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
* **AI Integration:** Google Gemini API
* **Database & Vector Search:** [Supabase](https://supabase.com/) (PostgreSQL + `pgvector`)
* **Payments:** Stripe API

---

## 🧠 How the AI (RAG) Pipeline Works

The core of SkillSync is our custom Retrieval-Augmented Generation pipeline:
1. **Embedding:** When a Business posts a job, the backend generates an embedding vector of the job description using Google's embedding models and stores it in Supabase `pgvector`.
2. **Semantic Search:** When a Student searches the market using natural language, their query is embedded and compared against all open jobs using cosine similarity.
3. **Analysis:** The top database matches are fed into the Gemini LLM to generate a personalized "Match Analysis" explaining exactly *why* these jobs fit the student's criteria.

---

## 🛠️ Local Development Setup

To run SkillSync locally on your machine, follow these steps.

### Prerequisites
* Node.js (v18+)
* Python (3.9+)
* A free [Supabase](https://supabase.com/) account
* A free [Google Gemini API Key](https://aistudio.google.com/)
* A free [Stripe](https://stripe.com/) Developer account (optional, for billing portal)

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. Enable the `vector` extension: `CREATE EXTENSION vector;`
3. Create the `users`, `jobs`, and `pitches` tables.
4. Set up the `match_jobs_rag` SQL function for vector similarity search.

### 2. Backend Setup (FastAPI)
```bash
# Clone the repo
git clone [https://github.com/yourusername/skillsync.git](https://github.com/yourusername/skillsync.git)
cd skillsync/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add your keys
touch .env

# .env (Backend):
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_test_key


# Start the FastAPI Server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup (Next.js)
```bash
# Open a new terminal instance
cd ../frontend

# Install Node modules
npm install

# Create a .env.local file
touch .env.local

# .env.local (Frontend):
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

# Start the development server
npm run dev
```
