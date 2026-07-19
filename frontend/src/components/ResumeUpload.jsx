import { useState } from 'react';

const ResumeUploader = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("https://localhost:5000/api/resume/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setScore(data.score); // Backend eken ena score eka
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">AI Resume Scanner</h2>
      <input type="file" onChange={handleUpload} className="mb-4" />
      
      {loading && <p>AI is analyzing your profile...</p>}
      
      {score && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-emerald-700 font-bold text-lg">AI Match Score: {score}%</p>
        </div>
      )}
    </div>
  );
};