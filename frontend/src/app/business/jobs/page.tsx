"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

// Define the shape of the data coming from FastAPI
interface Job {
  id: string;
  title: string;
  category: string;
  status: string;
  escrow_amount: number;
  created_at: string;
}

export default function JobsListPage() {
  const listRef = useRef<HTMLDivElement>(null);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch the jobs from FastAPI
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Using the mock ID we established
        const MOCK_CLIENT_ID = "001";
        
        const response = await fetch(`http://127.0.0.1:8000/api/business/${MOCK_CLIENT_ID}/jobs`);
        if (!response.ok) throw new Error("Failed to load jobs");
        
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 2. Trigger Anime.js only after data has loaded
  useEffect(() => {
    if (isLoading || !listRef.current || jobs.length === 0) return;
    
    createTimeline().add(listRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading, jobs.length]);

  // Helper to map backend status to frontend UI colors
  const getStatusUI = (status: string) => {
    switch (status) {
      case 'collecting_pitches': 
        return { color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', label: 'Collecting Pitches' };
      case 'assigned': 
        return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Assigned' };
      case 'in_progress': 
        return { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'In Progress' };
      case 'review': 
        return { color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', label: 'Review' };
      case 'completed': 
        return { color: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300', label: 'Completed' };
      default: 
        return { color: 'bg-zinc-100 text-zinc-600', label: status };
    }
  };

  // Helper to format the ISO date into a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Job Listings</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Manage your active and past digital execution tasks.</p>
        </div>
        <Link 
          href="/business/jobs/create" 
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Post New Task
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/10">
          <p className="font-bold">Error loading jobs:</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No tasks posted yet</h3>
          <p className="text-sm font-medium text-zinc-500 mb-6">Create your first task to start receiving pitches from verified talent.</p>
          <Link 
            href="/business/jobs/create" 
            className="inline-flex rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Deploy First Task
          </Link>
        </div>
      ) : (
        <div ref={listRef} className="grid grid-cols-1 gap-4">
          {jobs.map((job) => {
            const statusUI = getStatusUI(job.status);

            return (
              <div key={job.id} className="opacity-0 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
                
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${statusUI.color}`}>
                      {statusUI.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5 capitalize">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      {job.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {formatDate(job.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                      Escrow: ₹{job.escrow_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                  {job.status === "collecting_pitches" && (
                    <div className="hidden md:flex flex-col text-right mr-4">
                      {/* Defaulting to 0 until the Pitch submission endpoint is built */}
                      <span className="text-xl font-black text-rose-600 dark:text-rose-400">0</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pitches</span>
                    </div>
                  )}
                  
                  <Link 
                    href={`/business/jobs/${job.id}`} 
                    className="w-full sm:w-auto text-center rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {job.status === "collecting_pitches" ? "Review Pitches" : "View Details"}
                  </Link>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}