"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";

export default function FeaturesPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current || !gridRef.current) return;
    const tl = createTimeline();

    tl.add(headerRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100)
    .add(gridRef.current.children, {
      opacity: [0, 1],
      y: [30, 0],
      duration: 800,
      ease: "outQuart",
      delay: (el: any, i: number) => i * 100,
    }, "-=400");
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30">
      
      {/* Global Navigation */}
      <Navbar />

      <div className="pt-32 pb-24 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 mb-6">
              System Capabilities
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl mb-6">
              Engineered for <br className="hidden md:block"/>
              <span className="text-teal-600 dark:text-teal-400">Execution.</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 md:text-xl font-medium leading-relaxed">
              A system designed to eliminate traditional freelancing friction through lightweight automation, structured escrows, and verifiable trust metrics.
            </p>
          </div>

          {/* Feature Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                title: "AI Job & Talent Matching", 
                desc: "Our custom Gemma-powered model scans student pools upon posting, auto-recommending candidates based on portfolio fit, cost, and historical trust tiers.", 
                icon: "🧠" 
              },
              { 
                title: "Smart Pitch Assistant", 
                desc: "An embedded AI intercepts low-effort student pitches, prompting them to refine their copy, attach specific portfolio assets, and optimize pricing before submitting.", 
                icon: "⚡" 
              },
              { 
                title: "Programmatic Escrow", 
                desc: "Funds are locked upon task assignment. The exact moment a business provides digital sign-off, the smart contract logic releases payment to the student instantly.", 
                icon: "🔐" 
              },
              { 
                title: "Automated Reassignment", 
                desc: "System guardrails automatically detect dropped milestones or task abandonment, instantly rolling the listing back into the open marketplace to prevent delays.", 
                icon: "🔄" 
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group rounded-3xl border border-zinc-200 bg-zinc-50/50 p-10 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 dark:hover:shadow-black/50"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl transition-transform group-hover:scale-110 dark:bg-teal-900/50">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}