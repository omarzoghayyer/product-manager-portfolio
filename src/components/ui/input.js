// src/components/ui/input.js
import React from "react";

export function Input({ className = "", ...props }) {
  const cls =
    "w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none";
  return <input {...props} className={[cls, className].join(" ")} />;
}
