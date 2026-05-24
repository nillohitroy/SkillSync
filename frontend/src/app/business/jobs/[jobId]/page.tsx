"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Define TypeScript interfaces mapping to our new backend payload
interface Pitch {
  id: string;
  content: string;
  ai_match_score: number;
  is_accepted: boolean;
  student_name: string;
  student_tier: string;
}

interface JobDetail {
  id: string;
  title: string;
  category: string;
  escrow_amount: number;
  status: string;
  deadline: string;
  pitches: Pitch[];
}

export default function JobReviewPage() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const pitchesRef = useRef<HTMLDivElement>(null);

  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Job details from FastAPI Securely
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          router.push('/login');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";        
        const response = await fetch(`${API_URL}/api/business/${userId}/jobs/${params.jobId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId // Required security header
          }
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to load job details");
        }
        
        const data = await response.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.jobId) {
      fetchJobDetails();
    }
  }, [params.jobId, router]);

  // 2. Trigger Anime.js only after data has loaded
  useEffect(() => {
    if (isLoading || !job || !contentRef.current || !pitchesRef.current) return;
    
    const tl = createTimeline();
    tl.add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100)
    .add(pitchesRef.current.children, {
      opacity: [0, 1],
      x: [-20, 0],
      duration: 600,
      ease: "outQuart",
      delay: (el: any, i: number) => i * 100,
    }, "-=200");
  }, [isLoading, job]);

  // Helpers for formatting
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  const getTierColors = (tier: string) => {
    const t = tier.toLowerCase();
    if (t.includes('gold')) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    if (t.includes('silver')) return "text-zinc-600 bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800";
    return "text-amber-700 bg-amber-100 dark:text-amber-500 dark:bg-amber-900/30"; // Bronze
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/10 mb-4">
          <p className="font-bold">Error loading job details:</p>
          <p className="text-sm">{error}</p>
        </div>
        <Link href="/business/dashboard" className="text-sm font-bold text-teal-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
      
      <div ref={contentRef}>
        {/* Header */}
        <div className="mb-8 opacity-0 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <Link href="/business/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Job Listings
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className={`flex h-3 w-3 rounded-full ${job.status === 'completed' ? 'bg-zinc-500' : 'bg-amber-500'}`}></span>
              <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
            </div>
            <p className="text-sm font-medium text-zinc-500 ml-6">
              Budget: ₹{job.escrow_amount.toLocaleString()} • Deadline: {formatDate(job.deadline)} • Task ID: <span className="font-mono text-xs">{job.id.substring(0,8)}...</span>
            </p>
          </div>
          
          <button className="hidden md:flex rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Edit Job Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pitches */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI-Filtered Pitches ({job.pitches.length})
          </h2>
          
          {job.pitches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-zinc-500 font-medium">No pitches have been submitted for this task yet.</p>
            </div>
          ) : (
            <div ref={pitchesRef} className="space-y-4">
              {job.pitches.map((pitch) => (
                <div key={pitch.id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500/50 dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {pitch.student_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{pitch.student_name}</h3>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold mt-1 ${getTierColors(pitch.student_tier)}`}>
                          {pitch.student_tier} Tier
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-black text-teal-700 dark:text-teal-400">₹{job.escrow_amount.toLocaleString()}</div>
                      <div className="text-xs font-bold text-zinc-500 flex items-center gap-1 mt-1 justify-end">
                        <svg className="h-3 w-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {pitch.ai_match_score}% Match
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100 dark:bg-zinc-900/80 dark:border-zinc-800/80 mb-6">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      "{pitch.content}"
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25">
                      Hire & Lock Escrow
                    </button>
                    <button className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                      View Portfolio
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Escrow Status */}
        <div className="hidden lg:block space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="font-bold mb-4">Escrow Status</h3>
            <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-500">Current Phase</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 capitalize">{job.status.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-500">Wallet Balance</span>
              <span className="text-sm font-bold">₹0.00</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-zinc-500">Required Lock</span>
              <span className="text-sm font-bold">₹{job.escrow_amount.toLocaleString()}</span>
            </div>
            <p className="text-xs font-medium text-zinc-400 mt-4 leading-relaxed">
              Upon clicking "Hire", ₹{job.escrow_amount.toLocaleString()} will be locked in the smart escrow contract until you provide Digital Sign-off.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}