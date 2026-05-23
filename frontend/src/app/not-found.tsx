"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import the Next.js router
import Navbar from "@/components/Navbar";

export default function NotFound() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // 2. Initialize the router

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
    <div className="flex min-h-screen flex-col bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      {/* Global Navbar included at the top */}
      <Navbar />

      {/* Main 404 Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div ref={contentRef} className="max-w-md">
          
          {/* Animated 404 Graphic */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-teal-500/10 opacity-0 dark:bg-teal-900/20">
            <svg className="h-12 w-12 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="mb-4 text-6xl font-black text-zinc-900 opacity-0 dark:text-white">404</h1>
          <h2 className="mb-4 text-xl font-bold text-zinc-700 opacity-0 dark:text-zinc-300">Page Not Found</h2>
          <p className="mb-8 text-sm font-medium text-zinc-500 opacity-0">
            The execution path you are looking for does not exist or has not been built yet.
          </p>

          <div className="flex flex-col gap-4 opacity-0 sm:flex-row sm:justify-center">
            {/* 3. Replaced window.history.back() with router.back() */}
            <button 
              onClick={() => router.back()}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              ← Go Back
            </button>
            <Link 
              href="/"
              className="rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25"
            >
              Return Home
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}