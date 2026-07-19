import React, { useState } from 'react';
import api from '../api';

// existingResume කියන එක Dashboard එකෙන් මෙතනට ගන්නවා
const UploadResume = ({ existingResume }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(''); 
    // අලුතින් upload කරපු එකක් තියෙනවාද කියලා බලන්න අලුත් state එකක්
    const [currentResume, setCurrentResume] = useState(existingResume);

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
            const response = await api.post('/api/candidate/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setUploadStatus('success');
            // Upload වුණාට පස්සේ අලුත් නම currentResume එකට දානවා (refresh නොකරම පෙන්නන්න)
            setCurrentResume(response.data.path || file.name);
            setFile(null); // Upload වුණාට පස්සේ තෝරපු file එක clear කරනවා
            
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            
            {/* කලින් Upload කරපු CV එකක් තියෙනවා නම් ඒක මෙතන පෙන්වනවා */}
            {currentResume && (
                <div className="mb-6 bg-neutral-950 p-4 rounded-xl border border-green-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-900/20 flex items-center justify-center text-green-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">Current Resume</p>
                            <p className="font-medium text-green-500 truncate max-w-[200px]">{currentResume}</p>
                        </div>
                    </div>
                </div>
            )}

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
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                    </div>
                    <div className="text-sm">
                        <span className="text-red-500 font-medium">{currentResume ? "Upload a new one" : "Click to browse"}</span> <span className="text-neutral-400">or drag and drop</span>
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

            {uploadStatus === 'success' && !file && (
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