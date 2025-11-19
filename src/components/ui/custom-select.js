// src/components/ui/custom-select.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const Ctx = createContext(null);

export function CustomSelect({ value, onValueChange, children, className = "" }) {
  const [internal, setInternal] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = value ?? internal;

  const setSelected = (val) => {
    setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <Ctx.Provider value={{ selected, setSelected, open, setOpen }}>
      <div ref={ref} className={`relative ${className}`}>{children}</div>
    </Ctx.Provider>
  );
}

export function CustomSelectTrigger({ className = "", children }) {
  const { open, setOpen } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex justify-between items-center w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[var(--primary)] focus:outline-none ${className}`}
    >
      {children}
      <svg
        className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </button>
  );
}

export function CustomSelectValue({ placeholder = "Select...", className = "" }) {
  const { selected } = useContext(Ctx);
  return <span className={`truncate text-gray-700 ${className}`}>{selected || placeholder}</span>;
}

export function CustomSelectContent({ className = "", children }) {
  const { open } = useContext(Ctx);
  if (!open) return null;
  return (
    <div className={`absolute z-50 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CustomSelectItem({ value, children, className = "" }) {
  const { selected, setSelected } = useContext(Ctx);
  const active = selected === value;
  return (
    <div
      onClick={() => setSelected(value)}
      className={`cursor-pointer px-3 py-2 text-sm rounded-md ${
        active ? "bg-blue-50 text-[var(--primary)]" : "text-gray-700 hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </div>
  );
}
