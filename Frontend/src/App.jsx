import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ResultsView from "./views/ResultsView";

export default function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // API State Variables
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError("Please upload a resume file first.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_title", jobTitle || "Software Engineer");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze/", {
        method: "POST",
        body: formData,
      });

      // 1. Parse JSON response first to extract backend/Gemini error messages
      let data = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        if (!response.ok) {
          throw new Error(`Server Error (${response.status}): Invalid response from server.`);
        }
      }

      // 2. Check HTTP status
      if (!response.ok) {
        // Display actual error returned from Django/Gemini if present
        throw new Error(data.error || data.detail || `Server error (${response.status}): Failed to analyze resume.`);
      }

      console.log("Backend AI Output:", data);

      // 3. Set output state and show ResultsView
      setAnalysisData(data);
      setIsAnalyzed(true);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsAnalyzed(false);
    setResumeFile(null);
    setJobTitle(""); // Clears target job title for a completely fresh start
    setAnalysisData(null);
    setError("");
  };

  return (
    <div>
      {!isAnalyzed ? (
        <HomePage
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <ResultsView
          jobTitle={jobTitle}
          fileName={resumeFile?.name || "Uploaded_Resume.pdf"}
          analysisData={analysisData}
          onReset={handleReset}
        />
      )}
    </div>
  );
}