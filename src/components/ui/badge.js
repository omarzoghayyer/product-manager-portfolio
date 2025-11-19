// src/components/ui/badge.js
import React from "react";

export function Badge({ children, className = "", variant = "neutral", ...props }) {
  const base =
    "inline-flex items-center rounded-full text-xs font-medium px-3 py-1 whitespace-nowrap";

  const palette = {
    neutral: "bg-gray-100 text-gray-700",
    outline: "border border-gray-300 text-gray-700",
    blue: "bg-blue-50 text-[var(--primary)]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700"
  };

  return (
    <span {...props} className={[base, palette[variant], className].join(" ")}>
      {children}
    </span>
  );
}
