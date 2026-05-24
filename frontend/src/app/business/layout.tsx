"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/UserDropdown";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actualRole, setActualRole] = useState<string | null>(null);

  // --- GATEKEEPER LOGIC ---
  useEffect(() => {
    const role = localStorage.getItem("role");
    setActualRole(role);
    
    if (role !== "sme") {
      setIsAuthorized(false);
      setIsLoading(false);
    } else {
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, []);

  // 1. Show a blank screen while checking credentials
  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center" />;
  }

  // 2. Show 404 / Unauthorized if they fail the role check
  if (!isAuthorized) {
    const isStudent = actualRole === "student";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center transition-colors duration-300">
        <h1 className="text-6xl font-black text-zinc-900 dark:text-zinc-50 mb-4">404</h1>
        <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">Access Denied</h2>
        <p className="text-sm text-zinc-500 mb-6 max-w-md">
          {isStudent 
            ? "You are currently logged in as Student Talent. You do not have permissions to view the Business Command Center."
            : "The page you are looking for does not exist, or you need to log in to view this dashboard."}
        </p>
        <Link 
          href={isStudent ? "/student/dashboard" : "/login"} 
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isStudent ? "Return to My Workspace" : "Log In"}
        </Link>
      </div>
    );
  }

  // 3. NORMAL LAYOUT RENDER (If Authorized)
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
            Overview / <span className="text-zinc-900 dark:text-zinc-50 capitalize">{pathname.split('/').pop() || 'Command Center'}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            
            {/* Dynamic Business Dropdown */}
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