"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function RegisterHub() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const tl = createTimeline();
    
    tl.add(containerRef.current.children, {
      opacity: [0, 1],
      y: [30, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 150,
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-6 relative z-10">
        <div ref={containerRef} className="w-full max-w-4xl">
          
          <div className="text-center mb-12 opacity-0">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl mb-4">Join the SkillSync Network</h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">Choose your account type to get started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0">
            {/* Business Card */}
            <Link href="/register/business" className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 transition-all hover:-translate-y-1 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-teal-500 group-hover:text-white dark:bg-zinc-800 dark:text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">I am a Business</h2>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">I want to post digital tasks, bypass agency overhead, and hire verified local talent instantly.</p>
              </div>
            </Link>

            {/* Talent Card */}
            <Link href="/register/talent" className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 transition-all hover:-translate-y-1 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-teal-500 group-hover:text-white dark:bg-zinc-800 dark:text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">I am Student Talent</h2>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">I want to build my portfolio, execute local digital tasks, and climb the Trust Path to earn.</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center opacity-0">
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              Already have an account? <Link href="/login" className="text-teal-600 font-bold hover:underline dark:text-teal-400">Log in here</Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}