// src/components/InsightCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";

/* ---------- Helpers ---------- */
const fmtPct = (num, digits = 1) => {
  const v = Number(num);
  if (!Number.isFinite(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}%`;
};

const normalize = (obj) => {
  if (!obj || typeof obj !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      out[k] = v.replace(/\s+/g, " ").trim();
    } else {
      out[k] = v;
    }
  }
  return out;
};

/* ---------- Component ---------- */
export default function InsightCard({ item }) {
  const normalized = normalize(item);

  const {
    title,
    date,
    ticker,
    p20,
    p50: median,
    p80,
    confidence,
    drivers,
    summary,
    user_guess_p50,
    source,
    horizon_days,
  } = normalized;

  const medianNum = Number(median);
  const userGuessNum =
    user_guess_p50 !== undefined && user_guess_p50 !== null
      ? Number(user_guess_p50)
      : null;

  const direction =
    Number(medianNum) > 0 ? "Up" : Number(medianNum) < 0 ? "Down" : "Flat";

  const safeTicker =
    typeof ticker === "string" && ticker.trim().length
      ? ticker.toUpperCase()
      : "";

  const driversDisplay = Array.isArray(drivers)
    ? drivers.join(", ")
    : drivers || "—";

  const horizon =
    Number.isFinite(Number(horizon_days)) && Number(horizon_days) > 0
      ? Number(horizon_days)
      : 10;

  // Summary: See more / See less
  const [expanded, setExpanded] = useState(false);
  const MAX_SUMMARY_CHARS = 320;
  const hasLongSummary = summary && summary.length > MAX_SUMMARY_CHARS;
  const visibleSummary = !summary
    ? ""
    : expanded || !hasLongSummary
    ? summary
    : `${summary.slice(0, MAX_SUMMARY_CHARS)}…`;

  // Writer helper: generated summary
  const [generatedSummary, setGeneratedSummary] = useState("");

  const handleCopyEmbed = () => {
    if (!item || !item.id) return;
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

    const id = item.id;
    const origin = window.location.origin || "";
    const embedCode = `<iframe src="${origin}/embed/${id}" width="420" height="220" frameborder="0"></iframe>`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(embedCode).catch(console.error);
    } else {
      // Fallback: create a temp textarea
      try {
        const textarea = document.createElement("textarea");
        textarea.value = embedCode;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (e) {
        console.error("Failed to copy embed code", e);
      }
    }
  };

  const handleGenerateSummary = () => {
    const t = safeTicker || "this name";
    const dirPhrase =
      medianNum > 0
        ? "tilted positive"
        : medianNum < 0
        ? "tilted negative"
        : "roughly neutral";

    const parts = [];

    parts.push(
      `Our IMI model interprets this signal on ${t} as ${dirPhrase} over the next ${horizon} days.`
    );

    if (Number.isFinite(medianNum)) {
      parts.push(`Median excess move: ${fmtPct(medianNum, 2)} vs the market.`);
    }

    const p20Num = Number(p20);
    const p80Num = Number(p80);
    if (Number.isFinite(p20Num) && Number.isFinite(p80Num)) {
      parts.push(
        `80% interval runs from ${fmtPct(p20Num, 2)} to ${fmtPct(
          p80Num,
          2
        )}.`
      );
    }

    if (Number.isFinite(Number(confidence))) {
      const confInt = Math.round(Number(confidence));
      parts.push(`Forecast confidence: ~${confInt}%.`);
    }

    if (title) {
      parts.push(`Headline: "${title}".`);
    }

    const text = parts.join(" ");

    setGeneratedSummary(text);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 lg:p-6
                 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] transition-shadow duration-300
                 overflow-hidden"
    >
      {/* Header: IMI badge + date + metrics + embed button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Badge + meta + embed button */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-2 py-0.5 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              IMI
            </span>
            <span>{horizon}D Outlook</span>
            <span className="text-slate-600">•</span>
            <span className="truncate" title={date || "—"}>
              {date || "—"}
            </span>
          </div>

          {safeTicker && (
            <div className="mt-1 text-xs text-slate-500">
              {safeTicker} • AI impact snapshot
              {source ? ` • ${source}` : ""}
            </div>
          )}

          {/* Writer-facing: Copy embed */}
          {item?.id && (
            <button
              type="button"
              onClick={handleCopyEmbed}
              className="mt-2 text-[11px] text-emerald-400 hover:text-emerald-300"
            >
              Copy embed code
            </button>
          )}
        </div>

        {/* Right: Key metrics */}
        <div className="flex w-full justify-between gap-3 text-right text-xs sm:w-auto sm:text-sm sm:grid sm:grid-cols-3 sm:gap-3 sm:shrink-0">
          <Metric label="Direction" value={direction} subtle />
          <Metric label="Median" value={fmtPct(medianNum)} />
          <Metric
            label="Conf."
            value={`${
              Number.isFinite(Number(confidence))
                ? Math.round(Number(confidence))
                : "—"
            }%`}
            subtle
          />
        </div>
      </div>

      {/* Pills */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Pill label="Ticker" value={safeTicker || "—"} />
        <Pill label="Range (p20–p80)" value={`${fmtPct(p20)} → ${fmtPct(p80)}`} />
        <Pill label="Drivers" value={driversDisplay} />
      </div>

      {/* User guess pill */}
      {userGuessNum !== null && Number.isFinite(userGuessNum) && (
        <div className="mt-2">
          <Pill label="Your guess" value={fmtPct(userGuessNum)} />
        </div>
      )}

      {/* Summary with See more / See less */}
      {visibleSummary && (
        <div className="mt-3 text-sm text-slate-300/90 leading-6 break-words">
          <p>{visibleSummary}</p>
          {hasLongSummary && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-medium text-emerald-300 hover:text-emerald-200"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}

      {/* Writer helper: generated newsletter-style summary */}
      <div className="mt-4 border-t border-slate-800 pt-3">
        <button
          type="button"
          onClick={handleGenerateSummary}
          className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
        >
          Generate newsletter summary
        </button>
        {generatedSummary && (
          <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] leading-relaxed text-slate-200">
            {generatedSummary}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ---------- Subcomponents ---------- */
function Metric({ label, value, subtle = false }) {
  return (
    <div className="min-w-[70px]">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={subtle ? "text-slate-200" : "text-slate-50 font-semibold"}>
        {value}
      </div>
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
      <span className="text-slate-500 mr-1.5">{label}:</span>
      <span className="break-words hyphens-auto">{String(value)}</span>
    </div>
  );
}
