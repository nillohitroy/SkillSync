"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/UserDropdown";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Job Market", href: "/student/market", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" },
    { name: "Workspace", href: "/student/workspace", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Earnings", href: "/student/earnings", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
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
            <span className="font-extrabold tracking-tight">SkillSync Talent</span>
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/50 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 sticky top-0 z-40">
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Workspace / <span className="text-zinc-900 dark:text-zinc-50">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-500 border border-white dark:border-zinc-900"></span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            
            {/* Student Dropdown */}
            <div className="ml-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              <UserDropdown 
                name="Shyantani" 
                email="shyantani@student.edu" 
                initials="SH" 
                avatarColor="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400"
              />
            </div>
          </div>
        </header>
        
        {/* Force re-render on route change to fix Anime.js back-button freezing */}
        <div key={pathname} className="flex-1 flex flex-col h-full">
          {children}
        </div>
      </div>
    </div>
  );
}