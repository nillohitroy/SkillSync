"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/UserDropdown";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actualRole, setActualRole] = useState<string | null>(null);

  // --- GATEKEEPER LOGIC ---
  useEffect(() => {
    const role = localStorage.getItem("role");
    setActualRole(role);
    
    if (role !== "student") {
      setIsAuthorized(false);
      setIsLoading(false);
    } else {
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, []);

  // 1. Show a blank screen while checking credentials (prevents UI flashing)
  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center" />;
  }

  // 2. Show 404 / Unauthorized if they fail the role check
  if (!isAuthorized) {
    const isBusiness = actualRole === "sme";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center transition-colors duration-300">
        <h1 className="text-6xl font-black text-zinc-900 dark:text-zinc-50 mb-4">404</h1>
        <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">Access Denied</h2>
        <p className="text-sm text-zinc-500 mb-6 max-w-md">
          {isBusiness 
            ? "You are currently logged in as a Business. You do not have permissions to view the Student Workspace." 
            : "The page you are looking for does not exist, or you need to log in to view this workspace."}
        </p>
        <Link 
          href={isBusiness ? "/business/dashboard" : "/login"} 
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isBusiness ? "Return to My Dashboard" : "Log In"}
        </Link>
      </div>
    );
  }

  // 3. NORMAL LAYOUT RENDER (If Authorized)
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
            const isActive = pathname.startsWith(item.href);
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/50 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 sticky top-0 z-40">
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 truncate">
            Workspace / <span className="text-zinc-900 dark:text-zinc-50 capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            
            {/* Dynamic Student Dropdown */}
            <div className="ml-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              <UserDropdown />
            </div>
          </div>
        </header>
        
        {/* Protected Child Pages Render Here */}
        <div key={pathname} className="flex-1 flex flex-col h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
}