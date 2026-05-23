"use client";

import React from "react";

export default function StudentEarnings() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Earnings & Payouts</h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">Manage your platform revenue and track pending funds.</p>
        </div>
        <button className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-teal-500/20 hover:bg-teal-600 transition-colors">
          Withdraw Funds
        </button>
      </div>

      {/* Financial Breakdown Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="h-16 w-16 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Earnings</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-2">₹14,500</p>
          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-2 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +12% from last month
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Monthly Earnings</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-2">₹4,200</p>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-2">November 2024</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10 relative overflow-hidden">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Pending Payouts (Escrow)</p>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">₹1,800</p>
          <p className="text-xs font-medium text-amber-700/70 dark:text-amber-500/70 mt-2">Awaiting client sign-off</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Recent Transactions</h2>
          <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">Download CSV</button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Local Cafe Branding - Final Payout</p>
                <p className="text-xs font-medium text-zinc-500">Paid out to HDFC Bank ****1234 • Nov 18, 2024</p>
              </div>
            </div>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">+₹2,500</p>
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Salon Promo Reel - In Escrow</p>
                <p className="text-xs font-medium text-zinc-500">Awaiting Business Approval • Nov 22, 2024</p>
              </div>
            </div>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">₹1,800</p>
          </div>

        </div>
      </div>
    </div>
  );
}