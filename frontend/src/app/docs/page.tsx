"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";

export default function DocsPage() {
  const sidebarRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sidebarRef.current || !contentRef.current) return;
    const tl = createTimeline();

    // Stagger the sidebar navigation items
    tl.add(sidebarRef.current.querySelectorAll('li, h4'), {
      opacity: [0, 1],
      x: [-15, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 50,
    }, 100)
    // Stagger the main content blocks (headings, paragraphs, code blocks)
    .add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outQuart",
      delay: (el: any, i: number) => i * 100,
    }, "-=400");
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30">
      
      {/* Global Navigation */}
      <Navbar />

      <div className="mx-auto flex max-w-7xl px-6 pt-24">
        
        {/* Sidebar */}
        <aside ref={sidebarRef} className="hidden w-64 shrink-0 overflow-y-auto border-r border-zinc-200/80 py-10 pr-6 dark:border-zinc-800/80 lg:block h-[calc(100vh-6rem)] sticky top-24">
          <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 opacity-0">Getting Started</h4>
          <ul className="mb-10 space-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <li className="text-teal-600 dark:text-teal-400 font-bold opacity-0">Introduction</li>
            <li className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors opacity-0">Platform Architecture</li>
            <li className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors opacity-0">Security & Guardrails</li>
            <li className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors opacity-0">Escrow Logic Maps</li>
          </ul>
          
          <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 opacity-0">AI Infrastructure</h4>
          <ul className="space-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <li className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors opacity-0">Gemma 4 Fine-tuning</li>
            <li className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors opacity-0">Model Hosting (Prototyping)</li>
            <li className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors opacity-0">Smart Pitch Engine API</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 py-10 lg:pl-16 max-w-4xl">
          <div className="inline-flex items-center rounded-lg bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 mb-6 opacity-0">
            v1.0.0 Documentation
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-6 opacity-0">Introduction to SkillSync</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 font-medium leading-relaxed opacity-0">
            SkillSync (Project I-COCKROACH) is a hyperlocal digital execution marketplace engineered to bridge the gap between SMEs and verified student talent. It replaces high-friction agency retainers with a trustless, API-driven escrow network.
          </p>
          
          <hr className="my-10 border-zinc-200 dark:border-zinc-800 opacity-0" />

          <h2 className="text-2xl font-bold mt-12 mb-6 opacity-0">Core System Objectives</h2>
          <ul className="space-y-4 text-zinc-700 dark:text-zinc-300 mb-12 font-medium opacity-0">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 text-xs font-bold">1</span>
              Reduce agency dependency and lower execution costs for micro-businesses.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 text-xs font-bold">2</span>
              Create structured earning opportunities and an accessible, local digital workforce.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 text-xs font-bold">3</span>
              Drive SME growth while establishing a trust-verified execution network.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6 opacity-0">AI Model Integration</h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-6 opacity-0">
            The platform utilizes a custom-trained Gemma model to handle automated job matching, intelligent pitch interception, and platform moderation. Inference is handled dynamically via edge functions.
          </p>

          {/* Premium Terminal Code Block */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 dark:border-zinc-800 shadow-2xl opacity-0 my-8">
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="ml-2 text-xs font-mono text-zinc-500">lib/inference.ts</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <code className="text-sm font-mono text-zinc-300 leading-loose">
                <span className="text-zinc-500">// Intercept and evaluate incoming student pitches</span><br/>
                <span className="text-teal-400">const</span> <span className="text-blue-300">LLM_ENDPOINT</span> <span className="text-teal-400">=</span> process.env.GEMMA_INFERENCE_URL;<br/>
                <br/>
                <span className="text-teal-400">export async function</span> <span className="text-amber-200">evaluatePitch</span>(payload: PitchData) {'{\n'}
                {'  '}<span className="text-teal-400">const</span> response <span className="text-teal-400">= await</span> <span className="text-amber-200">fetch</span>(LLM_ENDPOINT, {'{\n'}
                {'    '}method: <span className="text-emerald-300">'POST'</span>,<br/>
                {'    '}headers: {'{'} <span className="text-emerald-300">'Content-Type'</span>: <span className="text-emerald-300">'application/json'</span> {'}'},<br/>
                {'    '}body: <span className="text-blue-300">JSON</span>.<span className="text-amber-200">stringify</span>(payload)<br/>
                {'  }'});<br/>
                <br/>
                {'  '}<span className="text-teal-400">return</span> response.<span className="text-amber-200">json</span>();<br/>
                {'}'}
              </code>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}