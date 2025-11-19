import React from "react";

// tiny helpers
const pct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
const fmtConf = (c) => `${Math.round(c * 100)}%`;
const cls = (...a) => a.filter(Boolean).join(" ");

const Row = ({ left, right }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <div className="text-gray-600">{left}</div>
    <div className="font-medium text-gray-900">{right}</div>
  </div>
);

// Trend arrow icon (squiggly line with arrow head)
function TrendArrowIcon({ dir = "up", className = "" }) {
  const base =
    "h-5 w-5 stroke-[2.2] transition-transform duration-200"; // 20px, thick stroke
  const rotate = dir === "down" ? "rotate-180" : dir === "flat" ? "-rotate-45" : "";
  const color =
    dir === "up" ? "text-emerald-600" : dir === "down" ? "text-rose-600" : "text-gray-500";

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${rotate} ${color} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* squiggle */}
      <path d="M3 16c2.5-5 6.5-3 9-6 1.2-1.4 2.5-3 4.5-3" />
      {/* arrow head */}
      <path d="M14 7h5m0 0v5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ARROW BADGE — shared for dialog + inline card
   ───────────────────────────────────────────── */
// Add/replace this near the top of ImpactCard.js
export function ArrowBadge({ medianPct = 0, className = "" }) {
  const dir = medianPct > 0 ? "up" : medianPct < 0 ? "down" : "flat";

  // Simple, valid fallback paths for any state
  const PATHS = {
    up:   "M3 14 L9 8 L13 12 L21 4",   // ↗ trend
    down: "M3 10 L9 16 L13 12 L21 20", // ↘ trend
    flat: "M3 12 H21"                  // →
  };
  const d = PATHS[dir] || PATHS.flat;

  const color =
    dir === "up" ? "text-emerald-600" :
    dir === "down" ? "text-rose-600" : "text-gray-500";

  return (
    <span className={`inline-flex items-center justify-center rounded-md bg-gray-50 border px-2 py-1 ${className}`}>
      <svg viewBox="0 0 24 24" width="18" height="18" className={color}>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="ml-2 text-sm font-medium capitalize">
        {dir === "up" ? "Up" : dir === "down" ? "Down" : "Flat"}
      </span>
    </span>
  );
}



/* ─────────────────────────────────────────────
   FULL IMPACT CARD (your original, unchanged)
   ───────────────────────────────────────────── */
export default function ImpactCard({
  summary,
  sectors = [],
  source,
  imi,
  metrics = [],
  assumptions = [],
  risks = [],
  nextCheckInDate,
  overallReceiptUrl,
  accuracyRibbon,
  className
}) {
  if (!imi) return null;
  const horizon = imi.horizonDays;

  return (
    <div className={cls("w-full mx-auto p-4 md:p-6 space-y-6 bg-white border rounded-2xl", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg md:text-xl font-bold text-gray-900">IMI — Impact Move Index™</div>
          <div className="text-gray-600 text-xs">Standardized {horizon}-day forecast • Model {imi.modelVersion || "v1"}</div>
        </div>
        {accuracyRibbon && (
          <div className="rounded-xl bg-gray-900 text-white px-3 py-1.5 text-xs shadow">
            {accuracyRibbon.label}: <span className="font-semibold">{Math.round(accuracyRibbon.valuePct)}%</span>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <div className="font-semibold mb-2">Summary</div>
          <p className="text-sm text-gray-800">{summary}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {sectors.map((s) => (
              <span key={s} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{s}</span>
            ))}
          </div>
          {source?.url && (
            <div className="mt-2 text-xs text-gray-500">
              Source:{" "}
              <a className="underline" href={source.url} target="_blank" rel="noreferrer">
                {source.title || source.url}
              </a>
              {source.publishedAt && ` • ${source.publishedAt}`} <span className="ml-2">(Paraphrased)</span>
            </div>
          )}
        </div>
      )}

      {/* Primary Benchmark */}
      <div className="border rounded-xl p-4">
        <div className="font-semibold text-gray-900 mb-2">
          Primary Benchmark ({imi.asset}{imi.ticker ? ` • ${imi.ticker}` : ""})
        </div>
        <Row left={`Median move (${horizon}d)`} right={pct(imi.medianPct)} />
        <Row left="Range [p20, p80]" right={`${pct(imi.rangePct[0])} to ${pct(imi.rangePct[1])}`} />
        <Row
          left={<span title={`Calibrated coverage based on ${imi.analogCount || "N/A"} analogs`}>Confidence (calibrated)</span>}
          right={fmtConf(imi.confidence)}
        />
        {nextCheckInDate && <Row left="Next check-in" right={nextCheckInDate} />}
        {overallReceiptUrl && (
          <a
            href={overallReceiptUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs"
          >
            View accuracy receipt
          </a>
        )}
        <div className="text-[11px] text-gray-500 mt-2">Informational only; not investment advice.</div>
      </div>

      {/* Asset rows (optional) */}
      {!!metrics.length && (
        <div className="border rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-3 py-2">ASSET</th>
                <th className="text-left px-3 py-2">MEDIAN</th>
                <th className="text-left px-3 py-2">RANGE</th>
                <th className="text-left px-3 py-2">CONF</th>
                <th className="text-left px-3 py-2">Δ vs. Market</th>
                <th className="text-left px-3 py-2">RECEIPT</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr key={`${m.asset}-${i}`} className="border-t">
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                    {m.asset}{m.ticker ? ` • ${m.ticker}` : ""}
                  </td>
                  <td className="px-3 py-2">{pct(m.medianPct)}</td>
                  <td className="px-3 py-2">{pct(m.rangePct[0])} to {pct(m.rangePct[1])}</td>
                  <td className="px-3 py-2">{fmtConf(m.confidence)}</td>
                  <td className="px-3 py-2">{m.modelVsMarketDeltaPct != null ? pct(m.modelVsMarketDeltaPct) : "—"}</td>
                  <td className="px-3 py-2">
                    {m.receiptUrl ? <a className="underline" href={m.receiptUrl} target="_blank" rel="noreferrer">Open</a> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-[11px] text-gray-500 px-3 py-2">Horizon for all rows: {horizon} trading days.</div>
        </div>
      )}

      {/* Assumptions & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4">
          <div className="font-semibold mb-2">Assumptions</div>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
            {assumptions.length ? assumptions.map((a, i) => <li key={i}>{a}</li>) : <li>No explicit assumptions provided.</li>}
          </ul>
        </div>
        <div className="border rounded-xl p-4">
          <div className="font-semibold mb-2">Risks / What could make this wrong?</div>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
            {risks.length ? risks.map((r, i) => <li key={i}>{r}</li>) : <li>No explicit risks provided.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MINIMAL IMI CARD — the lean UI we agreed on
   Shows: Arrow • Median • Confidence • 10d badge
   + up to 2 assets with their median
   Used for: right popover + inline on article
   ───────────────────────────────────────────── */
export function IMIMinCard({
  title = "Market Impact",
  horizonDays = 10,
  medianPct = 0,
  confidence = 0.6,
  assets = [], // [{label:'SOXX', medianPct:0.8}, {label:'XLF', medianPct:-0.3}]
  note,        // optional short line under the chip
}) {
  return (
    <div className="relative w-full rounded-2xl bg-white shadow-xl border overflow-hidden">
      {/* tiny top gradient bar (matches screenshot) */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-sky-500" />

      {/* header: icon + label */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-lg shadow-sm">
          ✦
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          {title}
          <span className="inline-flex h-1 w-1 rounded-full bg-gray-300" />
          <span className="text-gray-400">{horizonDays}d</span>
        </div>
      </div>

      {/* KPIs row */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-[auto,1fr,1fr] gap-3 items-stretch">
          <ArrowBadge medianPct={medianPct} className="self-stretch" />
          <div className="rounded-xl bg-gray-50 border p-3">
            <div className="text-[11px] text-gray-500">Median</div>
            <div className="text-xl font-semibold text-gray-900">{pct(medianPct)}</div>
          </div>
          <div className="rounded-xl bg-gray-50 border p-3">
            <div className="text-[11px] text-gray-500">Confidence</div>
            <div className="text-xl font-semibold text-gray-900">{fmtConf(confidence)}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">calibrated</div>
          </div>
        </div>
      </div>

      {/* asset chips (max 2) */}
      {!!assets?.length && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {assets.slice(0, 2).map((a) => (
            <span key={a.label} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-sm shadow-sm">
              <span className="font-medium">{a.label}</span>
              <span className={a.medianPct >= 0 ? "text-emerald-700" : "text-rose-700"}>{pct(a.medianPct)}</span>
            </span>
          ))}
        </div>
      )}

      {/* optional note line */}
      {note && (
        <div className="px-5 pb-5 text-sm text-gray-600">
          {note}
        </div>
      )}

      {/* soft glow backdrop */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full blur-3xl opacity-20 bg-sky-400" />
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl opacity-20 bg-indigo-400" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   POP OVER WRAPPER — right-side dialog
   (7in x 4in ~ 672x384) using the minimal card
   ───────────────────────────────────────────── */
export function IMIPopover({ open, onClose, children }) {
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed z-50 right-6 top-1/2 -translate-y-1/2 w-[672px] max-w-[90vw]">
        {children}
      </div>
    </>
  );
}
