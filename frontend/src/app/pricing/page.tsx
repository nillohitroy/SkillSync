"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";

export default function PricingPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current || !cardsRef.current) return;
    const tl = createTimeline();

    // Stagger the header text
    tl.add(headerRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 150,
    }, 100)
    // Stagger the pricing cards
    .add(cardsRef.current.children, {
      opacity: [0, 1],
      y: [40, 0],
      duration: 800,
      ease: "outQuart",
      delay: (el: any, i: number) => i * 200,
    }, "-=400");
  }, []);

  // Reusable checkmark SVG component for cleaner code
  const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={`h-5 w-5 shrink-0 ${className || "text-teal-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30">
      
      {/* Global Navigation */}
      <Navbar />

      <div className="pt-32 pb-24 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 mb-6 opacity-0">
              SME Pricing Strategy
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-6 opacity-0">
              Execution at a fraction <br className="hidden md:block"/> of the cost.
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed opacity-0">
              No 15k-1L/month agency retainers. Pay only for what gets executed by our local talent network.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Free Tier */}
            <div className="group rounded-3xl border border-zinc-200 bg-zinc-50/50 p-10 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 dark:hover:shadow-black/50 opacity-0 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Pay-as-you-go</h3>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight">₹0</span>
                <span className="text-zinc-500 font-semibold">/ platform fee</span>
              </div>
              <p className="mb-8 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Perfect for micro-businesses with occasional, one-off digital execution needs.
              </p>
              
              <ul className="mb-10 space-y-4 font-medium flex-1">
                <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <CheckIcon /> Unlimited job postings
                </li>
                <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <CheckIcon /> Basic AI matching
                </li>
                <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <CheckIcon /> Escrow payment protection
                </li>
              </ul>
              
              <button className="w-full rounded-xl border-2 border-zinc-200 py-3.5 font-bold text-zinc-900 transition-all hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:hover:border-zinc-700">
                Start Posting Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="relative rounded-3xl border-2 border-teal-500 bg-zinc-900 p-10 text-white shadow-2xl shadow-teal-500/10 transition-transform hover:-translate-y-1 dark:bg-zinc-50 dark:text-zinc-900 opacity-0 flex flex-col">
              <div className="absolute -top-4 right-8 rounded-full bg-teal-500 px-4 py-1 text-xs font-black tracking-widest text-white shadow-sm">
                RECOMMENDED
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Execution Pipeline</h3>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight">₹1,499</span>
                <span className="text-zinc-400 dark:text-zinc-500 font-semibold">/ month</span>
              </div>
              <p className="mb-8 text-zinc-300 dark:text-zinc-600 font-medium leading-relaxed">
                For SMEs requiring consistent weekly workflows and dedicated local talent pipelines.
              </p>
              
              <ul className="mb-10 space-y-4 font-medium flex-1">
                <li className="flex items-center gap-3">
                  <CheckIcon className="text-teal-400 dark:text-teal-600" /> Everything in Pay-as-you-go
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="text-teal-400 dark:text-teal-600" /> Repeat Job Automation (Cron-based)
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="text-teal-400 dark:text-teal-600" /> Priority Access to Gold/Pro Talent
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="text-teal-400 dark:text-teal-600" /> Dedicated WhatsApp Bot integration
                </li>
              </ul>
              
              <button className="w-full rounded-xl bg-teal-500 py-3.5 font-bold text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25">
                Upgrade to Pipeline
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}