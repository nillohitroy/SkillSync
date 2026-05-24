"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobSummary {
  id: string;
  title: string;
  category: string;
  escrow_amount: number;
  status: string;
}

interface StudentDashboardData {
  full_name: string;
  xp_points: number;
  trust_tier: string;
  pending_escrow: number;
  active_deliverables: JobSummary[];
  recommended_jobs: JobSummary[];
}

export default function StudentDashboard() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // RAG Pipeline States
  const [searchCriteria, setSearchCriteria] = useState("");
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [aiMatchResult, setAiMatchResult] = useState<any>(null);

  // Access Control States
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isWrongRole, setIsWrongRole] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token"); 

    if (!userId) {
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }

    if (role !== "student") {
      setIsWrongRole(true);
      setIsLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/student/${userId}/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setIsUnauthorized(true);
            return;
          }
          throw new Error("Failed to load dashboard data");
        }
        
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

  useEffect(() => {
    if (isLoading || isUnauthorized || isWrongRole || !contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading, isUnauthorized, isWrongRole]);

  // RAG Fetch Function
  const handleAiSearch = async () => {
    if (!searchCriteria.trim()) return;
    setIsSearchingAi(true);
    setAiMatchResult(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/match-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_criteria: searchCriteria })
      });
      if (!response.ok) throw new Error("AI Match Failed");
      const json = await response.json();
      setAiMatchResult(json);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the AI matching service.");
    } finally {
      setIsSearchingAi(false);
    }
  };

  // --- UI FOR RESTRICTED ACCESS ---
  if (isUnauthorized) return (<div className="flex flex-1 flex-col items-center justify-center p-6 text-center"><div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 max-w-md"><h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Authentication Required</h2><div className="flex flex-col gap-3"><Link href="/login" className="w-full rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-600">Log In</Link></div></div></div>);
  if (isWrongRole) return (<div className="flex flex-1 flex-col items-center justify-center p-6 text-center"><h1 className="text-6xl font-black text-zinc-900 dark:text-zinc-50 mb-4">404</h1><Link href="/business/dashboard" className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">Go to My Dashboard</Link></div>);
  if (isLoading) return (<div className="flex flex-1 items-center justify-center p-6"><svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>);
  if (error || !data) return (<div className="flex flex-1 items-center justify-center p-6 text-rose-500 font-bold">Error: {error || "Failed to load"}</div>);

  const nextTierTarget = 1000;
  const xpPercentage = Math.min((data.xp_points / nextTierTarget) * 100, 100);
  
  const getTierStyles = (tier: string) => {
    if (tier === 'gold') return { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]" };
    if (tier === 'silver') return { text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-400", glow: "shadow-[0_0_15px_rgba(161,161,170,0.5)]" };
    return { text: "text-amber-600 dark:text-amber-500", bg: "bg-amber-500", glow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]" };
  };
  const tierStyles = getTierStyles(data.trust_tier);

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {data.full_name.split(' ')[0]}</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Ready to execute? Here is your network status.</p>
        </div>
        <Link href="/student/market" className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
          Browse Job Market
        </Link>
      </div>

      {/* Gamified Trust & Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 opacity-0">
        <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-4 w-4 rounded-full ${tierStyles.bg} ${tierStyles.glow}`}></div>
                <h3 className={`text-sm font-bold uppercase tracking-wider capitalize ${tierStyles.text}`}>
                  {data.trust_tier} Tier
                </h3>
              </div>
              <p className="text-3xl font-black">{data.xp_points} <span className="text-base text-zinc-500 font-medium">/ {nextTierTarget} XP</span></p>
              <p className="text-sm font-medium text-zinc-500 mt-2">Level up by completing tasks flawlessly.</p>
            </div>
            
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2 capitalize">
                <span>{data.trust_tier}</span>
                <span>{data.trust_tier === 'bronze' ? 'Silver' : 'Gold'}</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-3 dark:bg-zinc-800 overflow-hidden">
                <div className={`h-3 rounded-full transition-all duration-1000 ${tierStyles.bg}`} style={{ width: `${xpPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-teal-500/20 bg-teal-50/50 p-8 shadow-sm dark:border-teal-900/50 dark:bg-teal-900/10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl"></div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">Pending Escrow</h3>
          <p className="text-4xl font-black text-teal-900 dark:text-white mb-2">₹{data.pending_escrow.toLocaleString()}</p>
          <p className="text-sm font-medium text-teal-700 dark:text-teal-400">Locked in smart contracts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-0">
        {/* Active Workspace */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Active Deliverables
          </h2>
          
          {data.active_deliverables.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-zinc-500 font-medium">You have no active tasks. Browse the market to find your next gig.</p>
            </div>
          ) : (
            data.active_deliverables.map(job => (
              <div key={job.id} className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-sm font-medium text-zinc-500 mt-1 capitalize">{job.category}</p>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 capitalize dark:bg-teal-900/30 dark:text-teal-400">
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6">
                  Escrow locked: ₹{job.escrow_amount.toLocaleString()}. Deliver high quality work to trigger release.
                </p>
                
                <Link href={`/student/workspace/${job.id}`} className="block w-full rounded-xl bg-zinc-100 py-2.5 text-center text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  Open Workspace
                </Link>
              </div>
            ))
          )}
        </div>

        {/* AI Recommended Jobs (RAG PIPELINE UPDATE) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Matches For You
          </h2>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            
            {/* The RAG Search Input */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                placeholder="E.g., I want python web scraping jobs..."
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
              <button
                onClick={handleAiSearch}
                disabled={isSearchingAi || !searchCriteria}
                className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
              >
                {isSearchingAi ? "Searching..." : "Search"}
              </button>
            </div>

            {/* RAG Results Render */}
            {aiMatchResult ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-teal-50 p-4 border border-teal-100 dark:bg-teal-900/10 dark:border-teal-900/30">
                  <h3 className="font-bold text-teal-800 dark:text-teal-400 mb-2">AI Analysis</h3>
                  <p className="text-sm text-teal-700 dark:text-teal-300 whitespace-pre-wrap">
                    {aiMatchResult.analysis || aiMatchResult.message}
                  </p>
                </div>

                {aiMatchResult.jobs_found && aiMatchResult.jobs_found.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-3 text-sm">Vector DB Matches:</h4>
                    {aiMatchResult.jobs_found.map((job: {id: string, title: string}, idx: number) => (
                      <div key={idx} className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3 dark:border-zinc-800 last:border-0">
                        <span className="font-bold text-sm">{job.title}</span>
                        {/* THE FIX: Added the job.id to the URL path */}
                        <Link href={`/student/market/${job.id}/pitch`} className="shrink-0 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-500">
                          Draft Pitch
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Fallback to static recommendations if RAG hasn't been used yet
              data.recommended_jobs.length === 0 ? (
                <p className="text-zinc-500 font-medium text-center py-4">Search your criteria above to find RAG matches.</p>
              ) : (
                data.recommended_jobs.map((job, idx) => (
                  <div key={job.id} className={`flex items-start justify-between ${idx !== data.recommended_jobs.length -1 ? 'border-b border-zinc-100 pb-5 mb-5 dark:border-zinc-800' : ''}`}>
                    <div>
                      <h3 className="font-bold text-base">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Static Match</span>
                        <span className="text-xs font-medium text-zinc-500 capitalize">₹{job.escrow_amount.toLocaleString()} • {job.category}</span>
                      </div>
                    </div>
                    <Link href={`/student/market/${job.id}/pitch`} className="shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-500">
                      Draft Pitch
                    </Link>
                  </div>
                ))
              )
            )}
            
            <Link href="/student/market" className="mt-6 block text-center text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              View all local matches →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}