"use client";

import React from "react";

export default function BusinessBilling() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Billing & Escrow</h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">Manage your payment methods, escrow funds, and job invoices.</p>
        </div>
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Funds in Escrow */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10 relative overflow-hidden md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-500 uppercase tracking-wider">Active Escrow Funds</p>
              <p className="text-3xl font-black text-blue-800 dark:text-blue-400 mt-2">₹4,200</p>
              <p className="text-xs font-medium text-blue-700/70 dark:text-blue-500/70 mt-2">Locked across 3 active jobs. Funds release upon your digital sign-off.</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Platform Plan</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">Free Tier</p>
            <p className="text-xs text-zinc-500 mt-1">Pay-as-you-go per execution.</p>
          </div>
          <button className="mt-4 w-full rounded-md bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20 transition-colors border border-teal-200 dark:border-teal-500/20">
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Payment Methods</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 rounded bg-zinc-100 flex items-center justify-center font-bold text-xs text-blue-900 dark:bg-zinc-800 dark:text-blue-400 border border-zinc-200 dark:border-zinc-700">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Visa ending in 4242</p>
                  <p className="text-xs text-zinc-500">Expires 12/26</p>
                </div>
              </div>
              <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Default</span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add new card or UPI
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Recent Sign-Offs</h2>
            <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">View All</button>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            
            <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">WhatsApp Bot Automation Setup</p>
                <p className="text-xs text-zinc-500 mt-0.5">Signed off • Nov 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">₹1,200</p>
                <button className="text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400">Invoice</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Flyer Redesign for Event</p>
                <p className="text-xs text-zinc-500 mt-0.5">Signed off • Nov 10, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">₹800</p>
                <button className="text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400">Invoice</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}