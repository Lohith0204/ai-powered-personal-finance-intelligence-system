"use client";
import { useState } from "react";
import { uploadCSV } from "../services/api";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const result = await uploadCSV(file);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onUploadSuccess(result.predictions, result.insights);
    }
  };

  return (
    <div className="glass-card upload-card fade-in">
      <h2 className="card-title">Batch Intelligence</h2>
      <p className="card-subtitle">Upload your CSV to automatically categorize your spending insights using our AI.</p>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <label className="file-input-wrapper">
          <span className="file-btn">Choose CSV File</span>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="hidden-input"
          />
          <span className="file-name">{file ? file.name : "No file selected"}</span>
        </label>
        
        {error && <p className="error-text">{error}</p>}
        
        <button 
          type="submit" 
          disabled={!file || loading} 
          className={`primary-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Processing...' : 'Run Analysis'}
        </button>
      </form>
    </div>
  );
}
