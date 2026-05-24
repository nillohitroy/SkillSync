"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

// Define the interface for the incoming API data
interface MarketJob {
  id: string;
  title: string;
  client: string;
  category: string;
  budget: number;
  match: number;
  posted: string;
  desc: string;
}

export default function JobMarketPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Dynamic State
  const [jobs, setJobs] = useState<MarketJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Market Feed
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const MOCK_STUDENT_ID = "002"; // Ensure this matches your student UUID in Supabase
        const response = await fetch(`http://127.0.0.1:8000/api/student/${MOCK_STUDENT_ID}/market`);
        
        if (!response.ok) throw new Error("Failed to load marketplace");
        
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarket();
  }, []);

  // 2. Trigger Anime.js
  useEffect(() => {
    if (isLoading || !contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading, jobs.length, activeFilter]);

  // Helper function to format relative time
  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) return "Today";
    return rtf.format(daysDifference, 'day');
  };

  const filters = ["All", "Social Media", "Design", "Video", "Tech", "High Match"];

  // FIX: Properly map the UI filter text to the backend database string
  const filteredJobs = jobs.filter(job => {
    if (activeFilter === "All") return true;
    if (activeFilter === "High Match") return job.match >= 90;
    
    // Translates "Social Media" to "social", and "Design" to "design", etc.
    const backendCategoryString = activeFilter === "Social Media" ? "social" : activeFilter.toLowerCase();
    
    return job.category.toLowerCase() === backendCategoryString;
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header & Search */}
      <div className="mb-8 opacity-0">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Hyperlocal Job Market</h1>
        <p className="text-sm font-medium text-zinc-500 mb-6">Browse and pitch for tasks in your area. Priorities are given to higher Trust Tiers.</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search skills, clients, or keywords..." 
              className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-teal-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10 flex flex-wrap gap-2 opacity-0">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeFilter === filter 
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" 
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Error or Empty States */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600 opacity-0">
          <p className="font-bold">Error loading market feed:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!error && filteredJobs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-sm font-medium text-zinc-500">There are currently no open tasks matching your filter criteria.</p>
        </div>
      )}

      {/* Jobs Feed */}
      <div className="space-y-4 opacity-0">
        {filteredJobs.map((job) => (
          <div key={job.id} className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-teal-500/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col md:flex-row gap-6">
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {/* Nicely format "social" back to "Social Media" on the card */}
                  {job.category.toLowerCase() === 'social' ? 'Social Media' : job.category}
                </span>
                <span className="text-xs font-medium text-zinc-500">{getRelativeTime(job.posted)}</span>
              </div>
              <h2 className="text-xl font-bold mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{job.title}</h2>
              <p className="text-sm font-bold text-zinc-500 mb-4">{job.client}</p>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                {job.desc}
              </p>
              <div className="flex items-center gap-4 text-sm font-bold">
                <span className="flex items-center gap-1.5 text-zinc-900 dark:text-white">
                  Escrow: ₹{job.budget.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {job.match}% AI Match
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-end shrink-0 md:w-48 border-t border-zinc-100 pt-4 md:border-0 md:pt-0 dark:border-zinc-800">
              <Link 
                href={`/student/market/${job.id}/pitch`}
                className="w-full text-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25"
              >
                Draft Pitch
              </Link>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}