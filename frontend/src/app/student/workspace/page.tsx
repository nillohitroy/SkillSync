"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

interface WorkspaceJob {
  id: string;
  title: string;
  client: string;
  status: string;
  deadline: string;
  escrow_amount: number;
}

export default function StudentWorkspacePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [workspaces, setWorkspaces] = useState<WorkspaceJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const MOCK_STUDENT_ID = "002"; // Match your student ID
        const response = await fetch(`http://127.0.0.1:8000/api/student/${MOCK_STUDENT_ID}/workspaces`);
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  // 2. Trigger Anime.js
  useEffect(() => {
    if (isLoading || !contentRef.current) return;
    
    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading, workspaces.length]);

  // Helpers to preserve your exact design
  const getStatusColor = (status: string) => {
    if (status === 'review') return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
    if (status === 'in_progress') return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (status === 'revision') return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"; // Assigned
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 opacity-0">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Active Workspaces</h1>
        <p className="text-sm font-medium text-zinc-500">Manage your ongoing tasks, communicate with clients, and submit deliverables.</p>
      </div>

      {workspaces.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50 opacity-0">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No active workspaces</h3>
          <p className="text-sm font-medium text-zinc-500">Head over to the job market to pitch for new tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between">
              
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold capitalize ${getStatusColor(workspace.status)}`}>
                    {workspace.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-zinc-400 font-mono">ID: {workspace.id.substring(0,8)}</span>
                </div>
                
                <h2 className="text-xl font-bold mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{workspace.title}</h2>
                <p className="text-sm font-medium text-zinc-500 mb-6">Client: <span className="font-bold text-zinc-700 dark:text-zinc-300">{workspace.client}</span></p>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-500">Locked Escrow</span>
                    <span className="font-black text-teal-600 dark:text-teal-400">₹{workspace.escrow_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-500">Deadline</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{formatDeadline(workspace.deadline)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <Link 
                  href={`/student/workspace/${workspace.id}`}
                  className="block w-full text-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Enter Workspace
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}