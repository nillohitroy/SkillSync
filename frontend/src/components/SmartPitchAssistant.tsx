"use client";
import { useState } from "react";
import { aiService } from "@/lib/ai-api";

interface SmartPitchAssistantProps {
  jobTitle: string;
  jobDescription: string;
}

export default function SmartPitchAssistant({ jobTitle, jobDescription }: SmartPitchAssistantProps) {
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleEvaluate = async () => {
    if (!pitch.trim()) return;
    setLoading(true);
    try {
      const data = await aiService.evaluatePitch(jobTitle, jobDescription, pitch);
      setFeedback(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Draft Your Pitch</h3>
      <p className="text-sm text-gray-500">Our AI will review your pitch before you send it to the client.</p>
      
      <textarea
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px]"
        placeholder="Why are you the best fit for this job?"
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={handleEvaluate}
          disabled={loading || !pitch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Review with AI ✨"}
        </button>
        {feedback?.is_ready_to_send && (
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Submit Final Pitch
          </button>
        )}
      </div>

      {/* AI Feedback UI */}
      {feedback && (
        <div className={`mt-6 p-4 rounded-lg border ${feedback.is_ready_to_send ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-gray-800">AI Feedback Score: {feedback.score_out_of_10}/10</h4>
            <span className={`px-2 py-1 rounded text-xs font-bold ${feedback.is_ready_to_send ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
              {feedback.is_ready_to_send ? "Ready to Send" : "Needs Improvement"}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 mb-4"><strong>Critique:</strong> {feedback.critique}</p>
          
          <div className="mb-4">
            <strong className="text-sm text-gray-800 block mb-1">Suggested Rewrite:</strong>
            <div className="bg-white p-3 rounded border text-sm text-gray-600">
              {feedback.suggested_rewrite}
            </div>
            <button 
              onClick={() => setPitch(feedback.suggested_rewrite)}
              className="text-xs text-indigo-600 font-semibold mt-2 hover:underline"
            >
              Apply Rewrite
            </button>
          </div>

          {feedback.missing_assets_to_add?.length > 0 && (
            <div>
              <strong className="text-sm text-gray-800 block mb-1">Missing Portfolio Assets:</strong>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {feedback.missing_assets_to_add.map((asset: str, idx: int) => (
                  <li key={idx}>{asset}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}