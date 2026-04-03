"use client";
import { useState } from "react";
import { predictText } from "../services/api";

export default function ManualInput({ onPredictSuccess }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a transaction description.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await predictText(text);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Pass formatted object to parent
      onPredictSuccess({ 'Transaction Description': text, 'Predicted Category': result.prediction });
      setText("");
    }
  };

  return (
    <div className="glass-card h-full-flex">
      <h2 className="card-title">Real-Time Prediction</h2>
      <p className="card-subtitle">Manually enter a transaction description to see the AI categorization.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="e.g. Starbucks Coffee" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-input"
          />
        </div>
        
        {error && <p className="error-text">{error}</p>}
        
        <button 
          type="submit" 
          disabled={!text || loading} 
          className={`primary-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Analyzing...' : 'Categorize Transaction'}
        </button>
      </form>
    </div>
  );
}
