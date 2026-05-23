"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function AutomationsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Interactive state for toggling automations on/off
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({
    "auto-1": true,
    "auto-2": true,
    "auto-3": false,
  });

  useEffect(() => {
    if (!contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, []);

  const handleToggle = (id: string) => {
    setActiveToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const automations = [
    {
      id: "auto-1",
      title: "Instagram Reels (Set of 3)",
      category: "Social Media",
      frequency: "Every Monday at 9:00 AM",
      nextRun: "Oct 30, 2025",
      budget: 1500,
      talent: "Auto-matched (Priority to Gold)",
    },
    {
      id: "auto-2",
      title: "Weekly Newsletter Formatting",
      category: "Design",
      frequency: "Every Thursday at 10:00 AM",
      nextRun: "Nov 2, 2025",
      budget: 800,
      talent: "Assigned to: Shyantani",
    },
    {
      id: "auto-3",
      title: "Monthly Local SEO Audit",
      category: "Tech",
      frequency: "1st of every month",
      nextRun: "Nov 1, 2025",
      budget: 2500,
      talent: "Auto-matched (Priority to Tech Pool)",
    }
  ];

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Automated Workflows</h1>
          <p className="text-sm font-medium text-zinc-500">Manage your recurring execution pipelines and cron schedules.</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Create Automation
        </button>
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0">
        {automations.map((job) => {
          const isActive = activeToggles[job.id];
          
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
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => handleToggle(job.id)}
                  className={`relative flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-teal-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                >
                  <span className={`absolute left-1 h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
                  <span className="text-sm font-medium text-zinc-500">Frequency</span>
                  <span className="text-sm font-bold">{job.frequency}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
                  <span className="text-sm font-medium text-zinc-500">Escrow Per Cycle</span>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">₹{job.budget}</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-sm font-medium text-zinc-500">Execution Strategy</span>
                  <span className="text-sm font-bold truncate max-w-[180px] text-right">{job.talent}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs font-bold text-zinc-500">
                    {isActive ? `Next Run: ${job.nextRun}` : 'Paused'}
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

    </main>
  );
}