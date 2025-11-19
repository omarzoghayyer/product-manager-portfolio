// src/components/MarketImpactPill.jsx
import React from "react";
import { Sparkles } from "lucide-react";

export default function MarketImpactPill({ onClick, children = "Market Impact", className = "" }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full px-3 py-1.5 text-sm font-semibold text-white",
        // gradient + subtle ring like the screenshot
        "bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500",
        "ring-1 ring-white/25 shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
        // interaction
        "transition-all hover:brightness-105 active:scale-[0.98] focus:outline-none",
        "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400",
        className,
      ].join(" ")}
      title="Show Impact Move Index for this article"
    >
      <Sparkles className="h-4 w-4 -ml-0.5" />
      <span>{children}</span>
    </button>
  );
}
