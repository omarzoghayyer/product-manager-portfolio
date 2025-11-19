import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ImpactCard from "./insights/ImpactCard";

/**
 * MarketImpactDialog
 * Renders a backdrop + panel INSIDE the content column (#content-col).
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - impact: object | null   // data for <ImpactCard />
 *  - align: "right" | "center" (default: "right")
 *  - width: number (px)      // optional max width for panel/card (default: 520)
 */
export default function MarketImpactDialog({
  open,
  onClose,
  impact,
  align = "right",
  width = 520,
}) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Find the column container after mount
    const el = document.getElementById("content-col");
    setContainer(el || null);
  }, []);

  if (!open || !container) return null;

  const basePanelClasses =
    "bg-white z-50 shadow-2xl border rounded-none sm:rounded-none";

  const rightPanelClasses = `
    absolute top-0 right-0 h-full
    w-full sm:w-[${width}px}]
  `;

  const centeredPanelClasses = `
    absolute left-0 right-0 top-6 mx-auto
    w-full max-w-[${width}px}]
    rounded-2xl
  `;

  const panelClasses =
    align === "center"
      ? `${basePanelClasses} ${centeredPanelClasses}`
      : `${basePanelClasses} ${rightPanelClasses}`;

  return createPortal(
    <>
      {/* Backdrop only inside the column */}
      <div
        className="absolute inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={panelClasses}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Impact Move Index (IMI)</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm"
          >
            Close
          </button>
        </div>

        <div
          className={
            align === "center"
              ? "p-4"
              : "p-4 overflow-y-auto h-[calc(100%-56px)]"
          }
        >
          {impact ? (
            <ImpactCard {...impact} />
          ) : (
            <div className="text-sm text-gray-600">
              No IMI data available for this article.
            </div>
          )}
        </div>
      </div>
    </>,
    container
  );
}
