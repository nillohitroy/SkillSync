"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call and AI Processing
    setTimeout(() => {
      // Route to a mock active job board
      router.push("/business/jobs/job-123");
    }, 1500);
  };

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-8 opacity-0">
        <Link href="/business/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Post a New Task</h1>
        <p className="text-sm font-medium text-zinc-500 mt-1">Our AI will instantly match your prompt with verified local talent.</p>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Job Title</label>
              <input 
                required
                type="text" 
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                placeholder="e.g. Design 3 Instagram Reels for a Cafe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
              <select required className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500 appearance-none">
                <option value="">Select execution category...</option>
                <option value="social">Social Media & Content</option>
                <option value="design">Branding & Design</option>
                <option value="video">Video & Audio Editing</option>
                <option value="tech">Automation & Web</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Deadline</label>
              <input 
                required
                type="date" 
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
              Explicit Prompt <span className="text-zinc-400 font-normal ml-1">(Be highly specific)</span>
            </label>
            <textarea 
              required
              rows={5}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500 resize-none" 
              placeholder="Describe exactly what needs to be executed, including brand guidelines, formats, and deliverables..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Escrow Budget (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">₹</span>
                <input 
                  required
                  type="number" 
                  min="500"
                  step="100"
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-8 pr-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                  placeholder="1500"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex h-6 w-10 items-center rounded-full bg-zinc-300 transition-colors group-hover:bg-zinc-400 dark:bg-zinc-700">
                  <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform"></div>
                </div>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Set as recurring task (Cron)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing Match...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Deploy Task & Match
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}