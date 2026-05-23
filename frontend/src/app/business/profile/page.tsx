"use client";

import React from "react";

export default function BusinessProfile() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full">
      {/* Profile Header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-teal-100 text-3xl font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-400">
              AG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Aethon Grid</h1>
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Tech & Operations Startup</p>
              
              <div className="mt-2 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Kolkata, West Bengal
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                  Established 2022
                </span>
              </div>
            </div>
          </div>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
            Edit Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Trust & Activity Metrics */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Platform Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800/50">
                <p className="text-2xl font-black text-teal-600 dark:text-teal-400">12</p>
                <p className="text-xs font-semibold text-zinc-500 uppercase mt-1">Jobs Posted</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800/50">
                <p className="text-2xl font-black text-rose-500 dark:text-rose-400">4</p>
                <p className="text-xs font-semibold text-zinc-500 uppercase mt-1">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Contact Info</h2>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                founder@aethongrid.com
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                www.aethongrid.com
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: About & History */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">About the Business</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We are a hyperlocal tech solutions company looking to digitize processes for surrounding businesses. We frequently require digital execution assistance including social media creatives, automation scripting (Google Sheets, WhatsApp APIs), and landing page development to keep our operations agile.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Recent Execution Needs</h2>
            </div>
            
            <div className="space-y-3">
              {/* Job Entry 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">WhatsApp Bot Automation Setup</h3>
                  <p className="text-xs text-zinc-500 mt-1">Completed by Student Pro • ₹1,200 Budget</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded dark:bg-green-900/30 dark:text-green-400">Completed</span>
              </div>
              
              {/* Job Entry 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Weekly 3 Instagram Posts + Story</h3>
                  <p className="text-xs text-zinc-500 mt-1">Recurring task • Marketing Category</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded dark:bg-blue-900/30 dark:text-blue-400">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}