const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const aiService = {
  async matchJobs(studentCriteria: string) {
    const response = await fetch(`${API_BASE_URL}/api/match-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_criteria: studentCriteria }),
    });
    if (!response.ok) throw new Error("Failed to match jobs");
    return response.json();
  },

  async evaluatePitch(jobTitle: string, jobDescription: string, studentPitch: string) {
    const response = await fetch(`${API_BASE_URL}/api/evaluate-pitch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_title: jobTitle,
        job_description: jobDescription,
        student_pitch: studentPitch,
      }),
    });
    if (!response.ok) throw new Error("Failed to evaluate pitch");
    return response.json();
  },
};