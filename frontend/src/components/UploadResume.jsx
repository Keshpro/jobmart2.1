import React, { useState } from 'react';
import api from '../api';

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(''); // 'success' or 'error'

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus('');
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first.");

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Token එක api.js හරහා ස්වයංක්‍රීයව යවයි
            await api.post('/api/Candidate/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus('success');
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="border-2 border-dashed border-neutral-700 bg-neutral-950 hover:border-red-600/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <input 
                    type="file" 
                    id="resume-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                />
                <label 
                    htmlFor="resume-upload" 
                    className="cursor-pointer flex flex-col items-center gap-3 w-full"
                >
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                        {/* Simple Upload Icon SVG */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                    </div>
                    <div className="text-sm">
                        <span className="text-red-500 font-medium">Click to browse</span> <span className="text-neutral-400">or drag and drop</span>
                    </div>
                    <div className="text-xs text-neutral-500">PDF, DOC, DOCX (Max. 5MB)</div>
                </label>
            </div>

            {file && (
                <div className="mt-4 flex items-center justify-between bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                    <span className="text-sm text-neutral-300 truncate max-w-[200px]">{file.name}</span>
                    <button 
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded font-medium transition disabled:opacity-50"
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            )}

            {uploadStatus === 'success' && (
                <p className="mt-3 text-sm text-green-500 flex items-center gap-2">
                    ✓ Resume uploaded successfully!
                </p>
            )}
            {uploadStatus === 'error' && (
                <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                    ⚠ Failed to upload resume. Please try again.
                </p>
            )}
        </div>
    );
};

export default UploadResume;