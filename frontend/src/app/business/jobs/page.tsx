"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function JobsListPage() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    createTimeline().add(listRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, []);

  const jobs = [
    {
      id: "job-123",
      title: "Instagram Reels (Set of 3)",
      category: "Social Media",
      status: "Collecting Pitches",
      statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      budget: 1500,
      pitchesCount: 4,
      createdAt: "2 hours ago",
    },
    {
      id: "job-124",
      title: "Email Newsletter Template",
      category: "Design",
      status: "In Progress",
      statusColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      budget: 3000,
      pitchesCount: 12,
      createdAt: "2 days ago",
    },
    {
      id: "job-125",
      title: "Website Copy Review",
      category: "Content",
      status: "Completed",
      statusColor: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      budget: 800,
      pitchesCount: 5,
      createdAt: "1 week ago",
    }
  ];

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

      {/* Jobs List */}
      <div ref={listRef} className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="opacity-0 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
            
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{job.title}</h2>
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${job.statusColor}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  {job.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {job.createdAt}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                  Escrow: ₹{job.budget}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
              {job.status === "Collecting Pitches" && (
                <div className="hidden md:flex flex-col text-right mr-4">
                  <span className="text-xl font-black text-teal-600 dark:text-teal-400">{job.pitchesCount}</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pitches</span>
                </div>
              )}
              
              {/* Dynamic Link to [jobId] */}
              <Link 
                href={`/business/jobs/${job.id}`} 
                className="w-full sm:w-auto text-center rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {job.status === "Collecting Pitches" ? "Review Pitches" : "View Details"}
              </Link>
            </div>
            
          </div>
        ))}
      </div>

    </main>
  );
}