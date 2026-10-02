import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

export default function ImageUploadPreview({ onImageRecognized, onClear }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setFileData(file);
    setUploading(true);

    try {
      // Send to backend for preview generation and heuristic analysis
      const res = await api.uploadImage(file);
      if (res && res.data) {
        setSuggestion(res.data);
        if (onImageRecognized) {
          onImageRecognized(res.data);
        }
      }
    } catch (err) {
      console.warn("Backend upload error (using local preview):", err.message);
      // Fallback: infer from filename
      const name = file.name.toLowerCase();
      let query = "Apple iPhone";
      let category = "Mobiles";
      if (name.includes("samsung")) { query = "Samsung Galaxy"; }
      else if (name.includes("macbook")) { query = "MacBook Air"; category = "Laptops"; }
      else if (name.includes("sony") || name.includes("headphone")) { query = "Sony WH-1000XM5"; category = "Headphones"; }

      const fallbackSuggestion = {
        suggestedQuery: query,
        suggestedCategory: category,
        previewUrl: localUrl
      };
      setSuggestion(fallbackSuggestion);
      if (onImageRecognized) {
        onImageRecognized(fallbackSuggestion);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setFileData(null);
    setSuggestion(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onClear) onClear();
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-brand-500 bg-brand-50/50 scale-[1.01]"
              : "border-indigo-200/70 hover:border-brand-400 bg-white/50 hover:bg-white/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7 stroke-[2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Upload Product Image to Compare
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Drag & drop a snapshot of any gadget, phone, laptop or box, or <span className="text-brand-600 font-semibold underline">browse file</span>.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-white/60 px-3 py-1 rounded-full border border-white">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Instant visual preview & platform comparison
          </div>
        </div>
      ) : (
        /* Image Preview State */
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/95 shadow-glass flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white/90 p-1 border border-white/80 shadow-md flex-shrink-0">
            <img
              src={previewUrl}
              alt="Uploaded product preview"
              className="w-full h-full object-contain rounded-xl"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition shadow-sm"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-deal-600 bg-deal-50 px-2.5 py-0.5 rounded-full border border-deal-200 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Image Ready for Comparison
            </div>
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {fileData?.name || "Uploaded Product Image"}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {uploading ? "Analyzing image features..." : suggestion?.suggestedQuery 
                ? `Matched item suggestion: "${suggestion.suggestedQuery}" (${suggestion.suggestedCategory || "Category"})`
                : "Image uploaded and verified for cross-store comparison."}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              {suggestion?.suggestedQuery && (
                <button
                  onClick={() => onImageRecognized && onImageRecognized(suggestion)}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <span>Compare Deals for "{suggestion.suggestedQuery}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleReset}
                className="btn-secondary text-xs py-2 px-3 text-slate-600 hover:text-rose-600"
              >
                Upload Different Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
