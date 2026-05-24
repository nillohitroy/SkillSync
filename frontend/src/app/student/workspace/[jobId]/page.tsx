"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";
import { useParams } from "next/navigation";

interface WorkspaceDetail {
  id: string;
  title: string;
  client: string;
  status: string;
  deadline: string;
  escrow_amount: number;
  prompt_text: string;
}

export default function WorkspaceDetail() {
  const params = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [job, setJob] = useState<WorkspaceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const MOCK_STUDENT_ID = "002";
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/student/${MOCK_STUDENT_ID}/jobs/${params.jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (params.jobId) fetchJobDetails();
  }, [params.jobId]);

  useEffect(() => {
    if (isLoading || !job || !contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading, job]);

  const handleSubmission = async () => {
    if (!job) return;
    setIsSubmitting(true);
    try {
      const MOCK_STUDENT_ID = "002";
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/student/${MOCK_STUDENT_ID}/jobs/${job.id}/submit`, {
        method: "POST"
      });
      
      if (!response.ok) throw new Error("Submission failed");
      
      // Optimistic UI update
      setJob({ ...job, status: "review" });
    } catch (error) {
      console.error(error);
      alert("Failed to submit deliverables.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDeadline = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (!job) return null;

  // Derive UI state from database status
  const isSubmitted = job.status === "review" || job.status === "completed";

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 opacity-0">
        <Link href="/student/workspace" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Workspaces
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`flex h-3 w-3 rounded-full ${isSubmitted ? 'bg-teal-500' : 'bg-amber-500'}`}></span>
              <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
            </div>
            <p className="text-sm font-medium text-zinc-500 ml-6">
              Client: <span className="font-bold text-zinc-700 dark:text-zinc-300">{job.client}</span> • Deadline: {formatDeadline(job.deadline)}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Guaranteed Escrow</p>
            <p className="text-2xl font-black text-teal-700 dark:text-teal-400">₹{job.escrow_amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-0">
        
        {/* Left Column: Deliverables & Chat */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload Deliverables
            </h2>

            {isSubmitted ? (
              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center dark:border-teal-900/30 dark:bg-teal-900/10">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-2">Files Submitted Successfully</h3>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300 max-w-sm mx-auto">
                  {job.client} has been notified. The ₹{job.escrow_amount.toLocaleString()} escrow will be released upon their digital sign-off.
                </p>
                
                {/* Mock Uploaded File (In a full app, this would map over actual uploaded file records) */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-teal-200/50 bg-white p-3 text-left shadow-sm dark:border-teal-800/50 dark:bg-zinc-950">
                  <div className="flex items-center gap-3">
                    <svg className="h-8 w-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h12l6 6v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm11 2H4v16h16V9h-5V4zm-1 9v2H8v-2h6zm2-4v2H8V9h8z"/></svg>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">Delivery_Final_Export.zip</p>
                      <p className="text-xs text-zinc-500 font-medium">Uploaded successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900 mb-6">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg className="mb-3 h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="mb-1 text-sm text-zinc-500 font-bold"><span className="text-teal-600 dark:text-teal-400">Click to upload files</span> or drag and drop</p>
                    <p className="text-xs text-zinc-500 font-medium">ZIP, MP4, or PDF (MAX. 500MB)</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Message for Client</label>
                  <textarea 
                    rows={4}
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500 resize-none" 
                    placeholder="Describe your delivery, note any variations from the brief, or ask for feedback..."
                  ></textarea>
                </div>
              </>
            )}
          </div>
          
          {/* Client Prompt Reference */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Original Client Prompt
            </h3>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic whitespace-pre-wrap">
              "{job.prompt_text}"
            </p>
          </div>

        </div>

        {/* Right Column: Status & Submission */}
        <div>
          <div className="sticky top-24 space-y-6">
            
            {/* Action Card */}
            <div className={`rounded-3xl border-2 p-6 transition-all duration-500 ${isSubmitted ? 'border-teal-500/20 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-900/10' : 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'}`}>
              <h3 className="text-xl font-bold mb-2">{isSubmitted ? 'Awaiting Review' : 'Ready to Submit?'}</h3>
              <p className={`text-sm font-medium leading-relaxed mb-6 ${isSubmitted ? 'text-teal-700 dark:text-teal-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                {isSubmitted 
                  ? "You cannot make changes while the client is reviewing the files. If they request revisions, the workspace will unlock." 
                  : "Ensure all requirements from the prompt are met. Submitting will lock the files and notify the client for review."
                }
              </p>
              
              {!isSubmitted && (
                <button 
                  onClick={handleSubmission}
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-75 disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Deliverables'}
                </button>
              )}
            </div>

            {/* Escrow Tracker */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="font-bold mb-6">Escrow Tracker</h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent dark:before:via-zinc-800">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-teal-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-zinc-950">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Assigned</h4>
                    <p className="text-xs text-zinc-500 font-medium">Funds locked in contract.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-zinc-950 ${isSubmitted ? 'bg-teal-500' : 'bg-amber-500 ring-4 ring-amber-500/20'}`}>
                    {isSubmitted && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border ${!isSubmitted ? 'border-amber-500/30 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-900/10' : 'border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50'}`}>
                    <h4 className={`font-bold text-sm ${!isSubmitted ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100'}`}>In Progress</h4>
                    <p className={`text-xs font-medium ${!isSubmitted ? 'text-amber-600/80 dark:text-amber-500/80' : 'text-zinc-500'}`}>Working on deliverables.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-zinc-950 ${isSubmitted ? 'bg-amber-500 ring-4 ring-amber-500/20' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                  </div>
                  <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border ${isSubmitted ? 'border-amber-500/30 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-900/10' : 'border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 opacity-50'}`}>
                    <h4 className={`font-bold text-sm ${isSubmitted ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-500'}`}>Review</h4>
                    <p className={`text-xs font-medium ${isSubmitted ? 'text-amber-600/80 dark:text-amber-500/80' : 'text-zinc-400'}`}>Awaiting client action.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-zinc-200 dark:bg-zinc-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-zinc-950">
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 opacity-50">
                    <h4 className="font-bold text-sm text-zinc-500">Sign-Off & Pay</h4>
                    <p className="text-xs text-zinc-400 font-medium">Funds enter wallet.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}