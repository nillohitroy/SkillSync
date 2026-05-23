"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function JobMarketPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, []);

  const filters = ["All", "Social Media", "Design", "Video", "Tech", "High Match"];

  const jobs = [
    {
      id: "job-123",
      title: "Local Cafe Menu Redesign",
      client: "Brew & Bites",
      category: "Design",
      budget: 800,
      match: 95,
      posted: "2 hours ago",
      desc: "Need a modern, clean, 2-page menu design. Must incorporate our new branding colors and logo. Will provide all text and high-res images of food."
    },
    {
      id: "job-127",
      title: "Podcast Video Snippets (Weekly)",
      client: "Startup Hub Media",
      category: "Video",
      budget: 2500,
      match: 88,
      posted: "5 hours ago",
      desc: "Looking for an editor to take our 1-hour weekly podcast and cut 4 highly engaging YouTube Shorts/Reels with dynamic captions (Alex Hormozi style)."
    },
    {
      id: "job-128",
      title: "WhatsApp CRM Bot Setup",
      client: "Aethon Grid",
      category: "Tech",
      budget: 4000,
      match: 72,
      posted: "Yesterday",
      desc: "Need someone to configure a WhatsApp Business API bot to auto-reply to customer inquiries based on a provided FAQ sheet."
    }
  ];

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

      {/* Jobs Feed */}
      <div className="space-y-4 opacity-0">
        {jobs.map((job) => (
          <div key={job.id} className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-teal-500/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col md:flex-row gap-6">
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">{job.category}</span>
                <span className="text-xs font-medium text-zinc-500">{job.posted}</span>
              </div>
              <h2 className="text-xl font-bold mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{job.title}</h2>
              <p className="text-sm font-bold text-zinc-500 mb-4">{job.client}</p>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                {job.desc}
              </p>
              <div className="flex items-center gap-4 text-sm font-bold">
                <span className="flex items-center gap-1.5 text-zinc-900 dark:text-white">
                  Escrow: ₹{job.budget}
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