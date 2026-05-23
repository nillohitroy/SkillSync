"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);

  // Entrance Animations
  useEffect(() => {
    if (!heroRef.current || !capabilitiesRef.current || !workflowRef.current) return;

    const tl = createTimeline();

    const heroElements = heroRef.current.querySelectorAll('.animate-hero');
    tl.add(heroElements, {
      opacity: [0, 1],
      y: [30, 0],
      duration: 1000,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 150,
    }, 200);
    
    tl.add(capabilitiesRef.current, {
      opacity: [0, 1],
      y: [40, 0],
      duration: 1000,
      ease: "outQuart",
    }, "-=600");
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30">
      
      <Navbar />

      <div className="relative z-10">
        {/* Hero Section */}
        <main className="mx-auto max-w-7xl px-6 pt-40 pb-24 text-center md:pt-52">
          <div ref={heroRef} className="flex flex-col items-center">
            <div className="animate-hero mb-8 inline-flex items-center rounded-full border border-teal-200 bg-teal-50/50 px-4 py-1.5 text-sm font-semibold text-teal-800 backdrop-blur-md dark:border-teal-900/30 dark:bg-teal-900/20 dark:text-teal-300 shadow-sm">
              <span className="relative flex h-2.5 w-2.5 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              Hyperlocal Digital Marketplace
            </div>
            
            <h1 className="animate-hero text-6xl font-black tracking-tight md:text-8xl mb-8">
              Digital Execution <br/>
              <span className="text-teal-600 dark:text-teal-400">
                Instantly & Affordably.
              </span>
            </h1>
            
            <p className="animate-hero text-lg text-zinc-600 dark:text-zinc-400 md:text-2xl mb-12 max-w-3xl leading-relaxed font-medium">
              Bypass expensive agencies. SkillSync connects SMEs with verified, highly-skilled student talent for your routine digital, design, and tech tasks.
            </p>
            
            <div className="animate-hero flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <button className="rounded-xl bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-500 hover:shadow-teal-500/40 hover:-translate-y-0.5">
                Post Work — It's Free
              </button>
              <button className="rounded-xl border-2 border-zinc-200 bg-zinc-50/50 px-8 py-4 text-base font-bold text-zinc-900 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:hover:bg-zinc-800">
                Apply as Student Talent
              </button>
            </div>
          </div>
        </main>

        {/* Capabilities Category Grid */}
        <section id="features" ref={capabilitiesRef} className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold md:text-5xl">Built for routine digital needs</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium text-lg">Whatever you need executing, our talent pool can handle it.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Social Media", icon: "📱", desc: "Instagram reels, caption writing, DM management, and 1-week posting schedules." },
              { title: "Branding & Design", icon: "🎨", desc: "Logo redesigns, offer banners, menu designs, flyers, and packaging layouts." },
              { title: "Video Editing", icon: "🎬", desc: "Short-form content, podcast clips, YouTube shorts, and subtitle editing." },
              { title: "Automation & Tech", icon: "⚙️", desc: "WhatsApp bots, Google Sheets automation, landing pages, and CRM cleanups." }
            ].map((cat, i) => (
              <div key={i} className="group rounded-3xl border border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 dark:hover:shadow-black/50">
                <div className="mb-6 text-4xl">{cat.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{cat.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section id="solutions" ref={workflowRef} className="mx-auto max-w-7xl px-6 py-24 mb-24 rounded-3xl border border-zinc-200 bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-8 md:p-8">
            <div>
              <div className="inline-flex items-center rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 mb-6">
                System Architecture
              </div>
              <h2 className="text-3xl font-extrabold md:text-5xl mb-6">How execution happens on SkillSync.</h2>
              <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-8">A trusted ecosystem engineered for hyperlocal business execution, backed by our smart escrow system.</p>
              <button className="rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-6 py-3 font-bold hover:-translate-y-0.5 transition-transform shadow-lg shadow-zinc-900/20 dark:shadow-white/10">
                Read the Documentation
              </button>
            </div>
            <div className="space-y-8">
              {[
                { step: "1", title: "Post an Explicit Prompt", desc: "Input your requirements, set your budget, and choose a deadline." },
                { step: "2", title: "Receive AI-Matched Pitches", desc: "Review proposals containing the student's value proposition and past portfolios." },
                { step: "3", title: "Assign & Track Live", desc: "Move your candidate through our pipeline: Pending → Progress → Revision." },
                { step: "4", title: "Digital Sign-Off", desc: "Approve the final work. Escrow logic instantly releases your payment." }
              ].map((flow, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-900 font-black text-xl transition-colors group-hover:bg-teal-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-50 dark:group-hover:bg-teal-500">
                    {flow.step}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{flow.title}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{flow.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}