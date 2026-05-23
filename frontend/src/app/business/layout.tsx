"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/business/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "My Jobs", href: "/business/jobs", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { name: "Post Job", href: "/business/jobs/create", icon: "M12 4v16m8-8H4" },
    { name: "Pipeline", href: "/business/pipeline", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Automations", href: "/business/automations", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 selection:bg-teal-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hidden md:flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500 text-white shadow-lg shadow-teal-500/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold tracking-tight">SkillSync SME</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400" 
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Snippet */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs">
              AG
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50">Aethon Grid</p>
              <p className="truncate text-xs font-medium text-zinc-500">Free Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/50 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 sticky top-0 z-40">
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Overview / <span className="text-zinc-900 dark:text-zinc-50">Command Center</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 border border-white dark:border-zinc-900"></span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div> {/* <-- THIS WAS MISSING */}
        </header>
        
        {/* Page Content Rendered Here */}
        {children}
      </div>
    </div>
  );
}