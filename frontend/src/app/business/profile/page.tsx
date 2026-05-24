"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessProfile() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", company_type: "", location: "", established_year: "", website: "", about_text: ""
  });

  const fetchProfile = async () => {
    // 1. Grab credentials from localStorage
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    // 2. Security Check: Redirect if not logged in
    if (!userId) {
      router.push("/login");
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/api/business/${userId}/profile`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setFormData({
          full_name: json.full_name || "",
          company_type: json.profile_data?.company_type || "",
          location: json.profile_data?.location || "",
          established_year: json.profile_data?.established_year || "",
          website: json.profile_data?.website || "",
          about_text: json.profile_data?.about_text || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => { 
    fetchProfile(); 
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId) return;

    const payload = {
      full_name: formData.full_name,
      profile_data: {
        company_type: formData.company_type,
        location: formData.location,
        established_year: formData.established_year,
        website: formData.website,
        about_text: formData.about_text
      }
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      await fetch(`${API_URL}/api/business/${userId}/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}) 
        },
        body: JSON.stringify(payload)
      });
      
      setIsEditing(false);
      // Re-fetch to update UI with latest database values
      fetchProfile();
      
      // Keep the LocalStorage name in sync with the database if they changed it
      localStorage.setItem("full_name", formData.full_name);
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  if (!data) return <div className="p-10 text-center animate-pulse text-zinc-500 font-medium">Loading profile data...</div>;

  // Helper function to extract initials
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full relative">
      
      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Company Name</label>
                <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Type / Industry</label>
                  <input value={formData.company_type} onChange={e => setFormData({...formData, company_type: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Location</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Established</label>
                  <input value={formData.established_year} onChange={e => setFormData({...formData, established_year: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Website</label>
                  <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">About</label>
                <textarea rows={3} value={formData.about_text} onChange={e => setFormData({...formData, about_text: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="flex-1 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 p-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-500 transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-teal-100 text-3xl font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-400">
              {getInitials(data.full_name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.full_name}</h1>
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">{data.profile_data?.company_type || "Company Industry"}</p>
              
              <div className="mt-2 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {data.profile_data?.location || "Location not set"}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                  Established {data.profile_data?.established_year || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
            Edit Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Platform Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800/50">
                <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{data.metrics?.total_jobs || 0}</p>
                <p className="text-xs font-semibold text-zinc-500 uppercase mt-1">Jobs Posted</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800/50">
                <p className="text-2xl font-black text-rose-500 dark:text-rose-400">{data.metrics?.active_jobs || 0}</p>
                <p className="text-xs font-semibold text-zinc-500 uppercase mt-1">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Contact Info</h2>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {data.email}
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                {data.profile_data?.website || "No website added"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: About & History */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">About the Business</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {data.profile_data?.about_text || "No description provided yet. Click Edit Details to add one."}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Recent Execution Needs</h2>
            </div>
            
            <div className="space-y-3">
              {(!data.recent_jobs || data.recent_jobs.length === 0) ? (
                <p className="text-sm text-zinc-500">No jobs posted yet.</p>
              ) : (
                data.recent_jobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{job.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">₹{job.budget} Budget</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded capitalize ${job.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}