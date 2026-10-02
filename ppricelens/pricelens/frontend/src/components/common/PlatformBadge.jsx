import React from "react";
import { getPlatformInfo } from "../../utils/platformUtils";

/**
 * Consistent styled initial badge (F, A, C, R) matching the liquid glass theme.
 * Replaces trademarked brand logo images across the app.
 */
export default function PlatformBadge({ platform, size = "md", className = "" }) {
  const info = getPlatformInfo(platform);

  const sizeClasses = {
    xs: "w-4 h-4 rounded-[5px] text-[9px]",
    sm: "w-5 h-5 rounded-md text-[10px]",
    md: "w-7 h-7 rounded-xl text-xs",
    lg: "w-12 h-12 rounded-2xl text-xl"
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none overflow-hidden ${selectedSize} ${info.gradient} ${info.shadow} border border-white/40 shadow-sm backdrop-blur-xs transition-transform duration-200 group-hover:scale-105 ${className}`}
      title={info.name}
      aria-label={info.name}
    >
      {/* Liquid glass light reflection sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />

      {/* Distinct styled platform initial */}
      <span className="relative z-10 font-extrabold text-white leading-none tracking-tight drop-shadow-xs">
        {info.initial}
      </span>
    </div>
  );
}
