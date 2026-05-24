"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for auth redirect

interface Automation {
  id: string;
  title: string;
  category: string;
  cron_schedule: string;
  is_cron_active: boolean;
  escrow_amount: number;
  assigned_student_name: string;
}

export default function AutomationsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);

  // 1. Fetch the Automations securely from FastAPI
  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            router.push('/login');
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/business/${userId}/automations`, {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId // Required security header
          }
        });

        if (!response.ok) {
           if (response.status === 403) throw new Error("Permission denied.");
           throw new Error("Failed to load automations");
        }
        
        const data = await response.json();
        setAutomations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAutomations();
  }, [router]);

  // 2. Trigger Anime.js
  useEffect(() => {
    if (isLoading || !contentRef.current) return;
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading, automations.length]);

  // 3. Handle toggling the state directly in the Database
  const handleToggle = async (jobId: string, currentStatus: boolean) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    // Optimistic UI Update: Flip it locally instantly for a snappy feel
    setAutomations(prev => prev.map(auto => 
      auto.id === jobId ? { ...auto, is_cron_active: !currentStatus } : auto
    ));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/business/${userId}/automations/${jobId}/toggle`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": userId 
        }
      });
      
      if (!response.ok) throw new Error("Failed to toggle automation");
    } catch (err) {
      console.error(err);
      alert("Database sync failed. Reverting toggle.");
      // Revert if API fails
      setAutomations(prev => prev.map(auto => 
        auto.id === jobId ? { ...auto, is_cron_active: currentStatus } : auto
      ));
    }
  };

  // 4. NEW: Demo function to force trigger the cron engine
  const forceTriggerCron = async () => {
      setIsTriggering(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/business/trigger-automations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        
        if (!response.ok) throw new Error("Failed to trigger engine.");
        
        const result = await response.json();
        alert(`Success! ${result.automations_triggered} new jobs were automatically generated and sent to the market.`);
      } catch (err) {
          alert("Failed to trigger automations. Ensure backend is running.");
      } finally {
          setIsTriggering(false);
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
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Automated Workflows</h1>
          <p className="text-sm font-medium text-zinc-500">Manage your recurring execution pipelines and cron schedules.</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          {/* NEW BUTTON FOR DEMO */}
          <button 
            onClick={forceTriggerCron}
            disabled={isTriggering}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-50"
          >
            {isTriggering ? "Running Engine..." : "Force Trigger Demo"}
          </button>

          <Link 
            href="/business/jobs/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Create Automation
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600 opacity-0">
          <p className="font-bold">Error loading automations:</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : automations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Automations Active</h3>
          <p className="text-sm font-medium text-zinc-500 mb-6">Select "Set as recurring task (Cron)" when posting a job to create an automation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0">
          {automations.map((job) => {
            const isActive = job.is_cron_active;
            
            return (
              <div key={job.id} className={`relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${isActive ? 'border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50' : 'border-zinc-200/50 bg-zinc-50/50 dark:border-zinc-800/50 dark:bg-zinc-950/50 grayscale-[0.5] opacity-70'}`}>
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className={`h-5 w-5 ${isActive ? 'text-teal-500' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{job.category}</span>
                    </div>
                    <h2 className="text-xl font-bold">{job.title}</h2>
                  </div>
                  
                  <button 
                    onClick={() => handleToggle(job.id, isActive)}
                    className={`relative flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-teal-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                  >
                    <span className={`absolute left-1 h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
                    <span className="text-sm font-medium text-zinc-500">Frequency</span>
                    <span className="text-sm font-bold capitalize">{job.cron_schedule}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
                    <span className="text-sm font-medium text-zinc-500">Escrow Per Cycle</span>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">₹{job.escrow_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-sm font-medium text-zinc-500">Execution Strategy</span>
                    <span className="text-sm font-bold truncate max-w-[180px] text-right">{job.assigned_student_name || "Auto-Matched Pool"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-bold text-zinc-500">
                      {isActive ? `Automated via Cron` : 'Paused'}
                    </span>
                  </div>
                  <button className="text-sm font-bold text-zinc-900 transition-colors hover:text-teal-600 dark:text-white dark:hover:text-teal-400">
                    Edit Config
                  </button>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}