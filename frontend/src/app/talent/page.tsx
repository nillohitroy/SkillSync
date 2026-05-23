"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";

export default function TalentPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current || !gridRef.current || !ctaRef.current) return;
    const tl = createTimeline();

    tl.add(headerRef.current.children, {
      opacity: [0, 1],
      y: [30, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 150,
    }, 100)
    .add(gridRef.current.children, {
      opacity: [0, 1],
      y: [40, 0],
      duration: 800,
      ease: "outQuart",
      delay: (el: any, i: number) => i * 150,
    }, "-=400")
    .add(ctaRef.current, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
    }, "-=400");
  }, []);

  const tiers = [
    {
      name: "Bronze",
      theme: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
      iconTheme: "bg-amber-200/50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300"
    },
    {
      name: "Silver",
      theme: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-700/50",
      iconTheme: "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
    },
    {
      name: "Gold & Pro",
      theme: "bg-yellow-100/80 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30 relative",
      iconTheme: "bg-yellow-200/60 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30">
      
      {/* Global Navigation */}
      <Navbar />

      <div className="pt-32 pb-24 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* Header Section */}
          <div ref={headerRef} className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 mb-6 opacity-0">
              Student Talent Network
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl mb-8 opacity-0">
              Build your portfolio. <br/>
              <span className="text-teal-600 dark:text-teal-400">Earn while you learn.</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 md:text-xl mb-12 max-w-2xl font-medium leading-relaxed opacity-0">
              Stop competing with global agencies. We connect verified local students directly with businesses in your city for routine digital tasks.
            </p>
          </div>
          
          {/* Gamified Trust Tiers */}
          <div ref={gridRef} className="grid w-full max-w-5xl mx-auto grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`group flex flex-col items-center rounded-3xl border p-10 text-center transition-all hover:-translate-y-1 hover:shadow-xl opacity-0 ${tier.theme} hover:shadow-zinc-200/50 dark:hover:shadow-black/50`}
              >
                {idx === 2 && (
                  <div className="absolute -top-3 right-8 rounded-full bg-yellow-400 px-3 py-0.5 text-[10px] font-black tracking-widest text-yellow-950 shadow-sm dark:bg-yellow-500">
                    TOP EARNERS
                  </div>
                )}
                <div className={`h-16 w-16 rounded-2xl mb-6 flex items-center justify-center text-2xl font-bold transition-transform group-hover:scale-110 ${tier.iconTheme}`}>
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3">{tier.name} Tier</h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  Complete tasks, earn client ratings, and move up the Gamified Trust ladder to unlock higher-paying jobs and platform equity.
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div ref={ctaRef} className="flex justify-center opacity-0">
            <button className="rounded-xl bg-teal-600 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-500 hover:shadow-teal-500/40 hover:-translate-y-0.5">
              Create Student Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}