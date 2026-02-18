'use client';

import React, { useState, useRef } from 'react';

interface XmlUploadProps {
    onUploadComplete: () => void;
}

export function XmlUpload({ onUploadComplete }: XmlUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (file.type === "text/xml" || file.name.endsWith('.xml')) {
            setFile(file);
            setError(null);
        } else {
            setError("Please upload a valid XML file");
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/xml', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            onUploadComplete();
            setFile(null);
        } catch (err) {
            setError('Failed to upload and convert XML file');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".xml"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            {file ? file.name : "Drag & drop your XML file here"}
                        </p>
                        {!file && (
                            <p className="text-sm text-gray-500 mt-1">
                                or <button onClick={() => inputRef.current?.click()} className="text-emerald-600 hover:underline">browse</button> to upload
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded">
                            {error}
                        </p>
                    )}

                    {file && (
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${uploading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                        >
                            {uploading ? "Converting..." : "Convert & Save"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
