"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PitchAssistantPage() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [pitchText, setPitchText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | 'low' | 'high'>(null);

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

  const handleAnalysis = () => {
    if (pitchText.length < 10) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate Gemma AI Analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simple mock logic: if it's short, it's a weak pitch
      if (pitchText.length < 100) {
        setAnalysisResult('low');
      } else {
        setAnalysisResult('high');
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission and redirect to dashboard
    router.push("/student/dashboard");
  };

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 opacity-0">
        <Link href="/student/market" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Market
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Draft Your Pitch</h1>
        <p className="text-sm font-medium text-zinc-500">Task ID: {params.jobId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-0">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center justify-between">
                <span>Value Proposition</span>
                <span className={`text-xs ${pitchText.length > 100 ? 'text-teal-500' : 'text-zinc-400'}`}>
                  {pitchText.length} chars
                </span>
              </label>
              <textarea 
                required
                rows={6}
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500 resize-none" 
                placeholder="Explain why you are the best fit for this specific task. Mention tools you use, timelines, and past experience..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Portfolio Attachments (Optional)</label>
              <div className="flex w-full items-center justify-center">
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg className="mb-3 h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="mb-1 text-sm text-zinc-500 font-bold"><span className="text-teal-600 dark:text-teal-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-zinc-500 font-medium">ZIP, PDF, or JPG (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button 
                type="button" 
                onClick={handleAnalysis}
                disabled={isAnalyzing || pitchText.length < 10}
                className="rounded-xl border border-teal-500/30 bg-teal-50 px-6 py-3.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100 disabled:opacity-50 dark:border-teal-500/20 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/40"
              >
                {isAnalyzing ? "Analyzing Pitch..." : "Analyze with AI Assistant"}
              </button>
              
              <button 
                type="submit"
                disabled={analysisResult === 'low' || isAnalyzing}
                className="rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Submit Pitch to Client
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Assistant Panel */}
        <div>
          <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
              <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Smart Pitch Guardrails
            </h3>

            {!analysisResult && !isAnalyzing && (
              <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-900/80 dark:border-zinc-800/80 dark:text-zinc-400 leading-relaxed">
                SkillSync restricts low-effort pitches to maintain high trust with SMEs. Draft your pitch and click 'Analyze' to check if it passes the quality gate.
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="text-sm font-bold text-zinc-500 animate-pulse">Evaluating semantics & portfolio fit...</p>
              </div>
            )}

            {analysisResult === 'low' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-900/10">
                <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <h4 className="font-bold">Pitch Rejected by AI</h4>
                </div>
                <ul className="space-y-2 text-sm font-medium text-rose-600 dark:text-rose-300 ml-7 list-disc">
                  <li>Your pitch is too short and lacks detail.</li>
                  <li>You haven't mentioned the specific software you will use.</li>
                  <li>Consider attaching a past work sample.</li>
                </ul>
              </div>
            )}

            {analysisResult === 'high' && (
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900/30 dark:bg-teal-900/10">
                <div className="flex items-center gap-2 mb-2 text-teal-700 dark:text-teal-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h4 className="font-bold">High Quality Pitch</h4>
                </div>
                <p className="text-sm font-medium text-teal-600 dark:text-teal-300 leading-relaxed">
                  Excellent detail! The client is highly likely to accept this. You may now submit your pitch.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}