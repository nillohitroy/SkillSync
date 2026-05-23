"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import Link from "next/link";

export default function StudentWorkspacePage() {
  const contentRef = useRef<HTMLDivElement>(null);

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

  const activeWorkspaces = [
    {
      id: "job-123",
      title: "Instagram Reels (Set of 3)",
      client: "Aethon Grid",
      status: "In Review",
      statusColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      deadline: "Tomorrow, 5:00 PM",
      escrow: 1500,
      progress: 80,
    },
    {
      id: "job-129",
      title: "Brand Style Guide PDF",
      client: "Local Cafe Hub",
      status: "In Progress",
      statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      deadline: "Oct 30, 2025",
      escrow: 2500,
      progress: 30,
    }
  ];

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 opacity-0">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Active Workspaces</h1>
        <p className="text-sm font-medium text-zinc-500">Manage your ongoing tasks, communicate with clients, and submit deliverables.</p>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0">
        {activeWorkspaces.map((workspace) => (
          <div key={workspace.id} className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between">
            
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${workspace.statusColor}`}>
                  {workspace.status}
                </span>
                <span className="text-xs font-bold text-zinc-400">ID: {workspace.id}</span>
              </div>
              
              <h2 className="text-xl font-bold mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{workspace.title}</h2>
              <p className="text-sm font-medium text-zinc-500 mb-6">Client: <span className="font-bold text-zinc-700 dark:text-zinc-300">{workspace.client}</span></p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-500">Locked Escrow</span>
                  <span className="font-black text-teal-600 dark:text-teal-400">₹{workspace.escrow}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-500">Deadline</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{workspace.deadline}</span>
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
    </main>
  );
}