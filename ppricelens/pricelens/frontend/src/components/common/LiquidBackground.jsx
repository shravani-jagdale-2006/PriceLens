import React from "react";

export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Soft gradient base: pale blue, lavender, white blend */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFF] via-[#F1F3FD] to-[#FAF8FF] opacity-90" />

      {/* Blob 1: Soft Indigo / Blue (top left) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-45 bg-gradient-to-tr from-indigo-300 via-blue-300 to-indigo-200 animate-float-slow"
      />

      {/* Blob 2: Soft Violet / Lavender (top right) */}
      <div
        className="absolute top-[5%] -right-[15%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[110px] opacity-40 bg-gradient-to-br from-violet-300 via-purple-200 to-pink-200 animate-float-reverse"
      />

      {/* Blob 3: Soft Mint / Emerald (bottom left) */}
      <div
        className="absolute -bottom-[20%] left-[10%] w-[55vw] h-[55vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-35 bg-gradient-to-tr from-emerald-200 via-teal-200 to-cyan-200 animate-float-drift"
      />

      {/* Blob 4: Soft Sky Blue / Periwinkle (center right) */}
      <div
        className="absolute top-[45%] right-[5%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[95px] opacity-30 bg-gradient-to-bl from-blue-200 via-indigo-200 to-violet-100 animate-pulse-subtle"
      />

      {/* Subtle fine glass noise texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-80" />
    </div>
  );
}
