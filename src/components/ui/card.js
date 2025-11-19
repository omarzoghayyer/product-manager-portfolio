// src/components/ui/card.js
import React from "react";

export function Card({ className = "", ...props }) {
  const cls =
    "bg-white border border-gray-200 rounded-xl shadow-sm " + className;
  return <div {...props} className={cls} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div {...props} className={"px-5 py-4 " + className} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 {...props} className={"text-lg font-semibold " + className} />;
}
export function CardContent({ className = "", ...props }) {
  return <div {...props} className={"px-5 py-4 " + className} />;
}
