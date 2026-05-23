"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function BusinessDashboard() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Stagger all direct children of the main container
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, []);

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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10 opacity-0">
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <h3 className="text-sm font-bold uppercase tracking-wider">Active Tasks</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black">3</span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-1">In progress</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <h3 className="text-sm font-bold uppercase tracking-wider">Pending Pitches</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black">12</span>
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
            <span className="text-4xl font-black text-teal-900 dark:text-white">₹4,500</span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-1">Pending Sign-off</span>
          </div>
        </div>

      </div>

      {/* Active Pipeline Preview */}
      <div className="opacity-0">
        <h2 className="text-xl font-bold mb-4">Urgent Actions</h2>
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          
          {/* List Item 1 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <h4 className="font-bold">Instagram Reels (Set of 3)</h4>
              </div>
              <p className="text-sm font-medium text-zinc-500 ml-5">Social Media • Budget: ₹1,500</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[10px] font-bold">+4</div>
              </div>
              <button className="flex-1 sm:flex-none rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Review Pitches
              </button>
            </div>
          </div>

          {/* List Item 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <h4 className="font-bold">Email Newsletter Template</h4>
              </div>
              <p className="text-sm font-medium text-zinc-500 ml-5">Assigned to: Prothoma • Escrow: ₹3,000</p>
            </div>
            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-sm font-bold transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                Review Draft
              </button>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}