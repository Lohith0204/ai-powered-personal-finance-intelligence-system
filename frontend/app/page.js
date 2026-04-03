"use client";
import { useState } from "react";
import Image from "next/image";
import FileUpload from "../components/FileUpload";
import ManualInput from "../components/ManualInput";
import Dashboard from "../components/Dashboard";
import Insights from "../components/Insights";

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [insights, setInsights] = useState(null);

  const handlePredictions = (preds, ins = null) => {
    if (!Array.isArray(preds)) {
      setPredictions((prev) => [preds, ...prev]);
    } else {
      setPredictions(preds);
      if (ins) setInsights(ins);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div className="logo-container">
          <Image src="/logo.png" alt="AI Finance Logo" width={90} height={90} className="glow-logo" priority />
        </div>
        <h1 className="gradient-text">AI Financial Intelligence</h1>
        <p className="subtitle">
          Instantly categorize and analyze your spending behavior using our machine learning model.
        </p>
      </div>

      <div className="grid-2">
        <ManualInput onPredictSuccess={handlePredictions} />
        <FileUpload onUploadSuccess={handlePredictions} />
      </div>

      {insights && (
        <Insights data={insights} />
      )}

      {predictions.length > 0 && (
        <div className="fade-in">
          <Dashboard data={predictions} />
        </div>
      )}
    </main>
  );
}
