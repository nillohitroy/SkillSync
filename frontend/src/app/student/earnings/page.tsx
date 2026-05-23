"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";

export default function StudentEarningsPage() {
  const contentRef = useRef<HTMLDivElement>(null);

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

  const transactions = [
    {
      id: "TRX-8921-A",
      date: "Oct 24, 2025",
      description: "Instagram Reels (Set of 3)",
      client: "Aethon Grid",
      type: "Escrow Release",
      amount: "+₹1,500",
      status: "Cleared",
      statusColor: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30"
    },
    {
      id: "TRX-8922-B",
      date: "Oct 20, 2025",
      description: "Bank Withdrawal (HDFC ****4091)",
      client: "Self",
      type: "Withdrawal",
      amount: "-₹3,200",
      status: "Processed",
      statusColor: "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800"
    },
    {
      id: "TRX-8905-C",
      date: "Oct 15, 2025",
      description: "Website Copy Review",
      client: "Local Cafe Hub",
      type: "Escrow Release",
      amount: "+₹800",
      status: "Cleared",
      statusColor: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30"
    },
    {
      id: "TRX-8890-D",
      date: "Oct 10, 2025",
      description: "Email Newsletter Template",
      client: "TechFlow Solutions",
      type: "Escrow Release",
      amount: "+₹3,000",
      status: "Cleared",
      statusColor: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30"
    }
  ];

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Earnings & Escrow</h1>
          <p className="text-sm font-medium text-zinc-500">Track your locked funds, past payouts, and manage withdrawals.</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg dark:bg-zinc-50 dark:text-zinc-900">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          Withdraw Funds
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10 opacity-0">
        
        {/* Available to Withdraw */}
        <div className="rounded-3xl border-2 border-teal-500/20 bg-teal-50/50 p-8 shadow-sm dark:border-teal-900/50 dark:bg-teal-900/10 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">Available Balance</h3>
            <p className="text-5xl font-black text-teal-900 dark:text-white mb-2">₹2,100</p>
            <p className="text-sm font-medium text-teal-700 dark:text-teal-400">Ready for instant bank transfer</p>
          </div>
        </div>

        {/* Locked Escrow */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Locked in Escrow</h3>
          <p className="text-4xl font-black mb-2">₹1,500</p>
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500">
            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
            Awaiting client sign-off (1 active)
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Lifetime Earnings</h3>
          <p className="text-4xl font-black mb-2">₹12,400</p>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Since joining Oct 2025</p>
        </div>

      </div>

      {/* Ledger / Transaction History */}
      <div className="opacity-0">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Transaction History
        </h2>

        <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-bold uppercase text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Client / Destination</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-5">
                      <p className="font-bold text-zinc-900 dark:text-zinc-50 mb-0.5">{trx.description}</p>
                      <p className="text-xs font-medium text-zinc-500">{trx.date} • {trx.id}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-zinc-600 dark:text-zinc-400">{trx.client}</p>
                      <p className="text-xs font-medium text-zinc-400">{trx.type}</p>
                    </td>
                    <td className="px-6 py-5 text-right font-black whitespace-nowrap">
                      <span className={trx.amount.startsWith('+') ? 'text-teal-600 dark:text-teal-400' : 'text-zinc-900 dark:text-zinc-50'}>
                        {trx.amount}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${trx.statusColor}`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
            <button className="text-sm font-bold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400">
              Download Full Ledger (.CSV)
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}