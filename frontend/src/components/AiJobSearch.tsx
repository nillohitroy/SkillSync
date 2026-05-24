"use client";
import { useState } from "react";
import { aiService } from "@/lib/ai-api";

export default function AiJobSearch() {
  const [criteria, setCriteria] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!criteria.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await aiService.matchJobs(criteria);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to find matches.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">AI Job Matcher ✨</h2>
        <p className="text-sm text-gray-500 mb-4">
          Tell us what you're looking for (e.g., "I want social media design jobs under 10 hours a week").
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="What kind of work do you want to do?"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !criteria}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium disabled:opacity-50 transition-all"
          >
            {loading ? "Searching..." : "Find Matches"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-3">AI Analysis</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
            {result.analysis || result.message}
          </p>

          {result.jobs_found && result.jobs_found.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Top Matches Retrieved:</h4>
              <div className="flex flex-wrap gap-2">
                {result.jobs_found.map((jobTitle: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                    {jobTitle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}