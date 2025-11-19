// src/components/ui/button.js
import React from "react";

export function Button({
  children,
  className = "",
  variant = "primary", // 'primary' | 'outline' | 'ghost' | 'icon'
  size = "md",         // 'sm' | 'md' | 'lg' | 'icon'
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantMap = {
    primary:
      "bg-[var(--primary)] text-white hover:bg-[var(--primary-light)] focus:ring-[var(--primary-light)]",
    outline:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-[var(--primary)]",
    ghost:
      "text-gray-600 hover:bg-gray-100 focus:ring-[var(--primary)]",
    icon:
      "text-gray-600 hover:bg-gray-100 focus:ring-[var(--primary)]"
  };

  const sizeMap = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
    icon: "h-9 w-9"
  };

  const cls = [base, variantMap[variant], sizeMap[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} className={cls}>
      {children}
    </button>
  );
}
