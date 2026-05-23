"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function JobReviewPage() {
  const params = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const pitchesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !pitchesRef.current) return;
    
    const tl = createTimeline();
    tl.add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100)
    .add(pitchesRef.current.children, {
      opacity: [0, 1],
      x: [-20, 0],
      duration: 600,
      ease: "outQuart",
      delay: (el: any, i: number) => i * 150,
    }, "-=200");
  }, []);

  const pitches = [
    {
      name: "Shyantani",
      tier: "Gold & Pro",
      tierColor: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
      matchScore: 98,
      bid: 1500,
      pitch: "I have created similar reel packages for 3 local cafes in the last month. I can execute this within your 48-hour deadline using CapCut Pro. Portfolio attached.",
      avatar: "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
    },
    {
      name: "Nillohit",
      tier: "Silver",
      tierColor: "text-zinc-600 bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800",
      matchScore: 85,
      bid: 1200,
      pitch: "Experienced in Premiere Pro and After Effects. Can handle the typography requirements for the reels perfectly. Can start immediately.",
      avatar: "bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
    }
  ];

  return (
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
      
      <div ref={contentRef}>
        {/* Header */}
        <div className="mb-8 opacity-0 flex justify-between items-start">
          <div>
            <Link href="/business/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Pipeline
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-3 w-3 rounded-full bg-amber-500"></span>
              <h1 className="text-3xl font-extrabold tracking-tight">Instagram Reels (Set of 3)</h1>
            </div>
            <p className="text-sm font-medium text-zinc-500 ml-6">Budget: ₹1,500 • Deadline: Oct 28 • Task ID: {params.jobId}</p>
          </div>
          
          <button className="hidden md:flex rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Edit Job Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pitches */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI-Filtered Pitches
          </h2>
          
          <div ref={pitchesRef} className="space-y-4">
            {pitches.map((pitch, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500/50 dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black ${pitch.avatar}`}>
                      {pitch.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{pitch.name}</h3>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold mt-1 ${pitch.tierColor}`}>
                        {pitch.tier} Tier
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-black text-teal-700 dark:text-teal-400">₹{pitch.bid}</div>
                    <div className="text-xs font-bold text-zinc-500 flex items-center gap-1 mt-1 justify-end">
                      <svg className="h-3 w-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {pitch.matchScore}% Match
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100 dark:bg-zinc-900/80 dark:border-zinc-800/80 mb-6">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    "{pitch.pitch}"
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25">
                    Hire & Lock Escrow
                  </button>
                  <button className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                    View Portfolio
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Escrow Status */}
        <div className="hidden lg:block space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="font-bold mb-4">Escrow Status</h3>
            <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-500">Current Phase</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Pitch Review</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-500">Wallet Balance</span>
              <span className="text-sm font-bold">₹12,400</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-zinc-500">Required Lock</span>
              <span className="text-sm font-bold">₹1,500</span>
            </div>
            <p className="text-xs font-medium text-zinc-400 mt-4 leading-relaxed">
              Upon clicking "Hire", ₹1,500 will be locked in the smart escrow contract until you provide Digital Sign-off.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}