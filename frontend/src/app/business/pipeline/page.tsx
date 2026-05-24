"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

interface PipelineJob {
  id: string;
  title: string;
  category: string;
  escrow_amount: number;
  status: string;
  created_at: string;
  assigned_student_name: string;
}

export default function PipelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch active pipeline securely
  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) throw new Error("Authentication error. Please log in.");
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/business/${userId}/pipeline`, {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId // Required security header
          }
        });

        if (!response.ok) {
          if (response.status === 403) throw new Error("Permission denied. You can only view your own pipeline.");
          throw new Error("Failed to load pipeline data");
        }
        
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPipeline();
  }, []);

  // 2. Trigger Anime.js
  useEffect(() => {
    if (isLoading || !containerRef.current) return;
    
    createTimeline().add(containerRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading]);

  // Derived Metrics
  const totalVolume = jobs.reduce((acc, job) => acc + job.escrow_amount, 0);
  const awaitingReview = jobs.filter(job => job.status === 'review').length;

  const getProgress = (status: string) => {
    switch(status) {
      case 'assigned': return 25;
      case 'in_progress': return 65;
      case 'review': return 95;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 opacity-0">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Execution Pipeline</h1>
        <p className="text-sm font-medium text-zinc-500">Track milestones, manage revisions, and execute programmatic escrow sign-offs.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600 opacity-0">
          <p className="font-bold">Error loading pipeline:</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Pipeline Empty</h3>
          <p className="text-sm font-medium text-zinc-500 mb-6">You do not have any tasks currently in execution. Once you assign talent, they will appear here.</p>
          <Link 
            href="/business/jobs/create"
            className="inline-flex rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25"
          >
            Post a New Task
          </Link>
        </div>
      ) : (
        <>
          {/* Overview Analytics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 opacity-0">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Active Volume</p>
              <p className="text-3xl font-black text-teal-700 dark:text-teal-400">₹{totalVolume.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Awaiting Sign-Off</p>
              <p className="text-3xl font-black text-amber-500">{awaitingReview} Task{awaitingReview !== 1 && 's'}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Executions</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white">{jobs.length}</p>
            </div>
          </div>

          {/* Pipeline Active Tracking Boards */}
          <div className="space-y-4 opacity-0">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Active Tracks
            </h2>

            {jobs.map((job) => (
              <div key={job.id} className="rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold truncate">{job.title}</h3>
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-800 capitalize dark:bg-zinc-800 dark:text-zinc-300">
                      {job.category}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-zinc-500 mb-4">
                    Assigned Talent: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{job.assigned_student_name}</span>
                  </p>

                  <div className="w-full bg-zinc-100 rounded-full h-2 dark:bg-zinc-800 max-w-md relative overflow-hidden">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${getProgress(job.status)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t border-zinc-100 pt-4 md:border-0 md:pt-0 dark:border-zinc-800">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Pipeline Stage</p>
                    <p className="text-sm font-extrabold text-teal-600 capitalize dark:text-teal-400">{job.status.replace('_', ' ')}</p>
                  </div>
                  <div className="text-left md:text-right hidden sm:block">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Locked Funds</p>
                    <p className="text-base font-black">₹{job.escrow_amount.toLocaleString()}</p>
                  </div>
                  
                  <Link 
                    href={`/business/pipeline/${job.id}`}
                    className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}