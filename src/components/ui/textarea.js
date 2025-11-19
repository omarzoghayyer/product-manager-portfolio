// src/components/ui/textarea.js
import React from "react";

export function Textarea({ className = "", ...props }) {
  const cls =
    "w-full min-h-[120px] px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none";
  return <textarea {...props} className={[cls, className].join(" ")} />;
}
