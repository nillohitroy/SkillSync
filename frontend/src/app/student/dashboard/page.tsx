"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function StudentDashboard() {
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Shyantani</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Ready to execute? Here is your network status.</p>
        </div>
        <Link 
          href="/student/market" 
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
          Browse Job Market
        </Link>
      </div>

      {/* Gamified Trust & Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 opacity-0">
        
        {/* Trust Tier Card */}
        <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Bronze Tier</h3>
              </div>
              <p className="text-3xl font-black">480 <span className="text-base text-zinc-500 font-medium">/ 1000 XP</span></p>
              <p className="text-sm font-medium text-zinc-500 mt-2">Complete 3 more tasks flawlessly to unlock <strong className="text-zinc-800 dark:text-zinc-200">Silver Tier</strong>.</p>
            </div>
            
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2">
                <span>Bronze</span>
                <span>Silver</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-3 dark:bg-zinc-800 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full transition-all duration-1000 w-[48%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="rounded-3xl border-2 border-teal-500/20 bg-teal-50/50 p-8 shadow-sm dark:border-teal-900/50 dark:bg-teal-900/10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl"></div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">Pending Escrow</h3>
          <p className="text-4xl font-black text-teal-900 dark:text-white mb-2">₹1,500</p>
          <p className="text-sm font-medium text-teal-700 dark:text-teal-400">Awaiting client sign-off</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-0">
        
        {/* Active Workspace */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Active Deliverables
          </h2>
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Instagram Reels (Set of 3)</h3>
                <p className="text-sm font-medium text-zinc-500 mt-1">Client: Aethon Grid</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                In Review
              </span>
            </div>
            
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6">
              You submitted "Cafe_Reels_Final_Export.zip". Awaiting client verification to release ₹1,500.
            </p>
            
            <Link href="/student/workspace/job-123" className="block w-full rounded-xl bg-zinc-100 py-2.5 text-center text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
              Open Workspace
            </Link>
          </div>
        </div>

        {/* AI Recommended Jobs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Matches For You
          </h2>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-5 mb-5 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-base">Local Cafe Menu Redesign</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">95% Match</span>
                  <span className="text-xs font-medium text-zinc-500">₹800 • Design</span>
                </div>
              </div>
              <button className="shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-500">
                Draft Pitch
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base">Podcast Video Snippets</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">88% Match</span>
                  <span className="text-xs font-medium text-zinc-500">₹2,000 • Video</span>
                </div>
              </div>
              <button className="shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-500">
                Draft Pitch
              </button>
            </div>
            
            <Link href="/student/market" className="mt-6 block text-center text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              View all 14 local matches →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}