"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function PipelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    createTimeline().add(containerRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, []);

  const pipelineJobs = [
    {
      id: "job-123",
      title: "Instagram Reels (Set of 3)",
      category: "Social Media",
      talent: "Shyantani",
      stage: "Review",
      progress: 60,
      budget: 1500,
      lastUpdate: "2 hours ago"
    },
    {
      id: "job-124",
      title: "Email Newsletter Template",
      category: "Design",
      talent: "Nillohit",
      stage: "In Progress",
      progress: 40,
      budget: 3000,
      lastUpdate: "Yesterday"
    },
    {
      id: "job-126",
      title: "WhatsApp Automation Bot",
      category: "Tech",
      talent: "Aman",
      stage: "Assigned",
      progress: 20,
      budget: 5000,
      lastUpdate: "3 days ago"
    }
  ];

  return (
    <main ref={containerRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 opacity-0">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Execution Pipeline</h1>
        <p className="text-sm font-medium text-zinc-500">Track milestones, manage revisions, and execute programmatic escrow sign-offs.</p>
      </div>

      {/* Overview Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 opacity-0">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Active Volume</p>
          <p className="text-3xl font-black">₹9,500</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Awaiting Sign-Off</p>
          <p className="text-3xl font-black text-amber-500">1 Task</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Avg. Target Turnaround</p>
          <p className="text-3xl font-black text-teal-600 dark:text-teal-400">42 Hours</p>
        </div>
      </div>

      {/* Pipeline Active Tracking Boards */}
      <div className="space-y-4 opacity-0">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Active Tracks
        </h2>

        {pipelineJobs.map((job) => (
          <div key={job.id} className="rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-bold truncate">{job.title}</h3>
                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  {job.category}
                </span>
              </div>
              
              <p className="text-sm font-medium text-zinc-500 mb-4">
                Assigned Talent: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{job.talent}</span> • Updated {job.lastUpdate}
              </p>

              {/* Progress Bar Component */}
              <div className="w-full bg-zinc-100 rounded-full h-2 dark:bg-zinc-800 max-w-md relative overflow-hidden">
                <div 
                  className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t border-zinc-100 pt-4 md:border-0 md:pt-0 dark:border-zinc-800">
              <div className="text-left md:text-right">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Pipeline Stage</p>
                <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400">{job.stage}</p>
              </div>
              <div className="text-left md:text-right hidden sm:block">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Locked Funds</p>
                <p className="text-base font-black">₹{job.budget}</p>
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

    </main>
  );
}