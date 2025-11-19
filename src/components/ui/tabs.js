// src/components/ui/tabs.js
import React from "react";

// Root
export function Tabs({ value, onValueChange, children, className = "" }) {
  const [internal, setInternal] = React.useState(value ?? "");
  const active = value ?? internal;

  // keep internal state in sync when controlled
  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const setVal = (v) => {
    setInternal(v);
    if (typeof onValueChange === "function") onValueChange(v);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (c) =>
        React.isValidElement(c)
          ? React.cloneElement(c, {
              activeValue: active,
              onChangeValue: setVal,
            })
          : c
      )}
    </div>
  );
}

// List (now forwards props to its children)
export function TabsList({ children, className = "", activeValue, onChangeValue }) {
  return (
    <div
      role="tablist"
      className={`inline-flex gap-2 p-1 bg-white border border-gray-200 rounded-lg ${className}`}
    >
      {React.Children.map(children, (c) =>
        React.isValidElement(c)
          ? React.cloneElement(c, {
              activeValue,
              onChangeValue,
            })
          : c
      )}
    </div>
  );
}

// Trigger (guard callback + a11y)
export function TabsTrigger({ value, activeValue, onChangeValue, className = "", children }) {
  const active = value === activeValue;
  const handleClick = () => {
    if (typeof onChangeValue === "function") onChangeValue(value);
  };
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`tab-panel-${value}`}
      onClick={handleClick}
      className={[
        "px-4 py-2 text-sm rounded-md transition",
        active ? "bg-[var(--primary)] text-white shadow-sm" : "text-gray-700 hover:bg-gray-100",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// Content (a11y id hookup)
export function TabsContent({ value, activeValue, className = "", children }) {
  if (value !== activeValue) return null;
  return (
    <div
      role="tabpanel"
      id={`tab-panel-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}
