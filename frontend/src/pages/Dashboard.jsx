import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [analysis, setAnalysis] = useState(null);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.post('/api/candidates/analyze-resume/1', formData);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching analysis", error);
    }
  };

  return (
    <div className="p-6">
      {analysis ? (
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold">Match Score: {analysis.matchScore}%</h2>
          <div className="mt-4">
            <h3 className="font-semibold text-green-600">Matched: {analysis.matchedSkills.join(', ')}</h3>
            <h3 className="font-semibold text-red-600">Missing: {analysis.missingSkills.join(', ')}</h3>
          </div>
          <p className="mt-4 italic">{analysis.summary}</p>
        </div>
      ) : (
        <button onClick={fetchAnalysis} className="bg-blue-500 text-white p-2 rounded">
          Run AI Analysis
        </button>
      )}
    </div>
  );
};

export default Dashboard;