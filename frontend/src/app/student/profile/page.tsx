"use client";

import React from "react";

export default function StudentProfile() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full">
      {/* Profile Header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">
              SH
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Shyantani</h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Digital Marketing & Design Enthusiast</p>
              
              {/* Trust Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Bronze Tier
              </div>
            </div>
          </div>
          <button className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-teal-500/20 hover:bg-teal-600 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Structured Data */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Background</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Verified College</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 flex items-center gap-2 mt-1">
                  <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Presidency University
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Experience Level</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mt-1">Intermediate (1-2 Years)</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Skills & Tools</h2>
            <div className="flex flex-wrap gap-2">
              {["Canva", "Video Editing", "Copywriting", "Instagram Growth", "CapCut", "Figma"].map((skill) => (
                <span key={skill} className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Preferred Categories</h2>
            <div className="flex flex-col gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-2">✦ Social Media Management</span>
              <span className="flex items-center gap-2">✦ Branding & Design</span>
              <span className="flex items-center gap-2">✦ Video Content Creation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Portfolio */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Portfolio Showcase</h2>
              <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">
                + Add Project
              </button>
            </div>
            
            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Project Card 1 */}
              <div className="group relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Local Cafe Branding</h3>
                  <p className="text-xs text-zinc-500 mt-1">Menu design and 5 Instagram posts.</p>
                </div>
              </div>
              
              {/* Project Card 2 */}
              <div className="group relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                   <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Salon Promo Reel</h3>
                  <p className="text-xs text-zinc-500 mt-1">Before/After video edit for IG Reels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}