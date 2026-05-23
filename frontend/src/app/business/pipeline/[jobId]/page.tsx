"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PipelineExecutionPage() {
  const params = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Interactive State
  const [activeStage, setActiveStage] = useState(3); // Mocking "Under Review" as the current stage
  const [isSignedOff, setIsSignedOff] = useState(false);

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

  const stages = [
    { id: 1, name: "Assigned" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Review" },
    { id: 4, name: "Revision" },
    { id: 5, name: "Completed" },
  ];

  const handleSignOff = () => {
    setIsSignedOff(true);
    setActiveStage(5);
    // In a real app, this triggers the smart contract/backend escrow release API
  };

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-10 opacity-0">
        <Link href="/business/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Command Center
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`flex h-3 w-3 rounded-full ${isSignedOff ? 'bg-teal-500' : 'bg-amber-500'}`}></span>
              <h1 className="text-3xl font-extrabold tracking-tight">Instagram Reels (Set of 3)</h1>
            </div>
            <p className="text-sm font-medium text-zinc-500 ml-6">
              Assigned to: <span className="font-bold text-zinc-700 dark:text-zinc-300">Shyantani</span> • Task ID: {params.jobId}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Locked Escrow</p>
            <p className="text-2xl font-black text-teal-700 dark:text-teal-400">₹1,500</p>
          </div>
        </div>
      </div>

      {/* Horizontal Pipeline Tracker */}
      <div className="mb-10 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
        <div className="relative flex items-center justify-between w-full">
          {/* Background Track */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full z-0"></div>
          
          {/* Active Track */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 rounded-full z-0 transition-all duration-700 ease-out"
            style={{ width: `${((activeStage - 1) / (stages.length - 1)) * 100}%` }}
          ></div>

          {/* Pipeline Nodes */}
          {stages.map((stage) => {
            const isCompleted = stage.id < activeStage;
            const isCurrent = stage.id === activeStage;
            
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white dark:border-zinc-950 font-bold transition-colors duration-500 ${
                    isCompleted ? 'bg-teal-500 text-white' : 
                    isCurrent ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 ring-4 ring-teal-500/20' : 
                    'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    stage.id
                  )}
                </div>
                <span className={`text-xs font-bold absolute -bottom-6 w-24 text-center ${
                  isCurrent ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500'
                }`}>
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-0">
        
        {/* Deliverables Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Workspace & Deliverables
          </h2>

          {isSignedOff ? (
            <div className="rounded-2xl border-2 border-teal-500/20 bg-teal-50/50 p-10 text-center dark:border-teal-900/50 dark:bg-teal-900/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-2">Execution Completed</h3>
              <p className="text-teal-700 dark:text-teal-300 font-medium max-w-md mx-auto">
                Escrow funds have been successfully released to Shyantani. The final files are available in your cloud storage.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-6 flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-900/80 dark:border-zinc-800/80">
                <div className="h-10 w-10 shrink-0 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center font-bold text-yellow-800 dark:text-yellow-200">
                  SH
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">Shyantani <span className="text-zinc-500 font-medium text-xs ml-2">2 hours ago</span></p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                    "Hey! I've uploaded the final exports for the 3 reels. I color-corrected them according to the brand guide and added the requested subtitle style. Let me know if you need any micro-adjustments!"
                  </p>
                </div>
              </div>

              {/* Mock File Attachment */}
              <div className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h12l6 6v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm11 2H4v16h16V9h-5V4zm-1 9v2H8v-2h6zm2-4v2H8V9h8z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Cafe_Reels_Final_Export.zip</h4>
                    <span className="text-xs font-medium text-zinc-500">245 MB • ZIP Archive</span>
                  </div>
                </div>
                <button className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  Download
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                  Request Revision
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel: Escrow Sign-off */}
        <div>
          <div className="sticky top-24 rounded-2xl border-2 border-zinc-900 bg-zinc-900 p-6 text-white shadow-xl dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 transition-all duration-500">
            {isSignedOff ? (
              <div className="text-center py-6">
                <h3 className="text-xl font-bold mb-2">Escrow Released</h3>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                  Transaction #TRX-8921-A verified.
                </p>
                <button className="mt-6 w-full rounded-xl bg-white/10 dark:bg-black/5 px-4 py-3 text-sm font-bold transition-colors hover:bg-white/20 dark:hover:bg-black/10">
                  Leave Student Review
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Final Approval</h3>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed mb-6">
                  Review the deliverables carefully. Providing Digital Sign-Off is an irreversible action that releases the <strong className="text-white dark:text-zinc-900">₹1,500</strong> escrow directly to the student's wallet.
                </p>
                <button 
                  onClick={handleSignOff}
                  className="w-full rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
                >
                  Digital Sign-Off & Pay
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secured by Smart Contract
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}