"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces mapping to your FastAPI Pydantic schemas
interface BusinessStats {
  total_active_volume: number;
  awaiting_signoff: number;
  active_tasks: number;
}

interface JobSummary {
  id: string;
  title: string;
  category: string;
  escrow_amount: number;
  status: string;
  created_at: string;
}

interface DashboardData {
  stats: BusinessStats;
  active_pipeline: JobSummary[];
}

export default function BusinessDashboard() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch data from FastAPI
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Using the mock ID we established earlier
        const MOCK_CLIENT_ID = "001";
        
        const response = await fetch(`http://127.0.0.1:8000/api/business/${MOCK_CLIENT_ID}/dashboard`);
        if (!response.ok) throw new Error("Failed to load dashboard data");
        
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // 2. Trigger Anime.js only after data has loaded
  useEffect(() => {
    if (isLoading || !contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading]);

  // Helper to map backend status to frontend UI colors and text
  const getStatusUI = (status: string) => {
    switch (status) {
      case 'collecting_pitches': 
        return { color: 'bg-rose-500', label: 'Collecting Pitches', action: 'Review Pitches' };
      case 'assigned': 
        return { color: 'bg-blue-500', label: 'Assigned', action: 'View Workspace' };
      case 'in_progress': 
        return { color: 'bg-amber-500', label: 'In Progress', action: 'Track Progress' };
      case 'review': 
        return { color: 'bg-teal-500', label: 'Awaiting Sign-off', action: 'Review Draft' };
      case 'completed': 
        return { color: 'bg-zinc-500', label: 'Completed', action: 'View Invoice' };
      default: 
        return { color: 'bg-zinc-300', label: status, action: 'View Details' };
    }
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

  if (error || !data) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-rose-500 font-bold">
        Error: {error || "Failed to load"}
      </div>
    );
  }

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto">
      
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Here is what is happening in your execution pipeline.</p>
        </div>
        <Link 
          href="/business/jobs/create" 
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Post New Task
        </Link>
      </div>

      {/* Metrics Grid mapped to FastAPI payload */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10 opacity-0">
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <h3 className="text-sm font-bold uppercase tracking-wider">Active Tasks</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black">{data.stats.active_tasks}</span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-1">In progress</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <h3 className="text-sm font-bold uppercase tracking-wider">Awaiting Sign-off</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black">{data.stats.awaiting_signoff}</span>
            <span className="text-sm font-medium text-rose-500 mb-1">Require action</span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-teal-500/20 bg-teal-50/50 p-6 shadow-sm dark:border-teal-900/50 dark:bg-teal-900/10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-500/10 blur-xl"></div>
          <div className="flex items-center gap-3 text-teal-800 dark:text-teal-300 mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <h3 className="text-sm font-bold uppercase tracking-wider">Locked in Escrow</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-teal-900 dark:text-white">
              ₹{data.stats.total_active_volume.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-1">Secured Funds</span>
          </div>
        </div>

      </div>

      {/* Active Pipeline Preview */}
      <div className="opacity-0">
        <h2 className="text-xl font-bold mb-4">Pipeline Actions</h2>
        
        {data.active_pipeline.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-zinc-500 font-medium">Your pipeline is currently empty. Post a task to get started.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            {data.active_pipeline.map((job) => {
              const statusUI = getStatusUI(job.status);
              
              return (
                <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-zinc-200 last:border-0 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`flex h-2.5 w-2.5 rounded-full ${statusUI.color}`}></span>
                      <h4 className="font-bold">{job.title}</h4>
                    </div>
                    <p className="text-sm font-medium text-zinc-500 ml-5">
                      <span className="capitalize">{job.category}</span> • Escrow: ₹{job.escrow_amount.toLocaleString()} • {statusUI.label}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <button 
                      onClick={() => router.push(`/business/jobs/${job.id}`)}
                      className={`w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                        job.status === 'review' || job.status === 'collecting_pitches'
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200' 
                          : 'border border-zinc-200 bg-transparent hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {statusUI.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}