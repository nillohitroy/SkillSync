"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentProfile() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", bio: "", college: "", experience_level: "", skills: "", preferred_categories: ""
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
      const res = await fetch(`http://127.0.0.1:8000/api/student/${userId}/profile`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      if (res.ok) {
        const json = await res.json();
        setData(json);
        
        const p = json.profile_data || {};
        setFormData({
          full_name: json.full_name || "",
          bio: p.bio || "",
          college: p.college || "",
          experience_level: p.experience_level || "",
          skills: Array.isArray(p.skills) ? p.skills.join(", ") : "",
          preferred_categories: Array.isArray(p.preferred_categories) ? p.preferred_categories.join(", ") : ""
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
        bio: formData.bio,
        college: formData.college,
        experience_level: formData.experience_level,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        preferred_categories: formData.preferred_categories.split(",").map(s => s.trim()).filter(Boolean)
      }
    };

    try {
      await fetch(`http://127.0.0.1:8000/api/student/${userId}/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      setIsEditing(false);
      // Re-fetch to update UI
      fetchProfile();
      
      // Update local storage so the Navbar dropdown updates instantly
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
                <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Short Headline / Bio</label>
                <input value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="e.g. Digital Marketing Enthusiast" className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">College</label>
                  <input value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Experience</label>
                  <input value={formData.experience_level} onChange={e => setFormData({...formData, experience_level: e.target.value})} placeholder="e.g. 1-2 Years" className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Skills (Comma Separated)</label>
                <input value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="Canva, React, Python" className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Preferred Categories (Comma Separated)</label>
                <input value={formData.preferred_categories} onChange={e => setFormData({...formData, preferred_categories: e.target.value})} placeholder="Design, Tech" className="w-full mt-1 p-2 rounded-lg border dark:bg-zinc-950 dark:border-zinc-800" />
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
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">
              {getInitials(data.full_name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.full_name}</h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">{data.profile_data?.bio || "Student Freelancer"}</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 capitalize">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {data.trust_tier || "Bronze"} Tier
              </div>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-teal-500/20 hover:bg-teal-600 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Background</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Verified College</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 flex items-center gap-2 mt-1">
                  <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {data.profile_data?.college || "No college verified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Experience Level</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mt-1">{data.profile_data?.experience_level || "Beginner"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Skills & Tools</h2>
            <div className="flex flex-wrap gap-2">
              {(data.profile_data?.skills || []).length > 0 ? (
                data.profile_data.skills.map((skill: string) => (
                  <span key={skill} className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-500">No skills added yet.</span>
              )}
            </div>
          </div>
          
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Preferred Categories</h2>
            <div className="flex flex-col gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {(data.profile_data?.preferred_categories || []).length > 0 ? (
                data.profile_data.preferred_categories.map((cat: string) => (
                  <span key={cat} className="flex items-center gap-2">✦ {cat}</span>
                ))
              ) : (
                <span className="text-sm text-zinc-500">No categories added yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Portfolio */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Portfolio Showcase</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(!data.portfolio || data.portfolio.length === 0) ? (
                <p className="text-sm text-zinc-500 col-span-2">No completed projects to showcase yet.</p>
              ) : (
                data.portfolio.map((item: any) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-900">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">{item.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1 capitalize">{item.category} Project</p>
                    </div>
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