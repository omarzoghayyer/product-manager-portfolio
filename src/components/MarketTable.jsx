// src/components/MarketTable.jsx
import { motion } from "framer-motion";

// Fixed column layout: ASSET | HEADLINE | MEDIAN | RANGE | CONF | DATE
const GRID_TEMPLATE = "90px minmax(250px,1fr) 110px 200px 120px 130px";

export default function MarketTable({ items = [], onSelect }) {
  const rows = items.map(normalizeRow);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
      {/* Header */}
      <div
        className="grid gap-2 border-b border-slate-800/80 bg-slate-900/50 px-4 py-2 text-xs uppercase tracking-wide text-slate-500"
        style={{ gridTemplateColumns: GRID_TEMPLATE }}
      >
        <div>Asset</div>
        <div>Headline</div>
        <div>Median</div>
        <div>Range p20–p80</div>
        <div>Confidence</div>
        <div>Date</div> {/* was "Updated" */}
      </div>

      {/* Rows */}
      <motion.ul layout className="divide-y divide-slate-800/70">
        {rows.map((r) => (
          <motion.li
            key={r.id}
            layout
            onClick={() => onSelect?.(r.raw)}
            className="grid gap-2 px-4 py-3 text-sm text-slate-200 cursor-pointer transition-colors"
            style={{ gridTemplateColumns: GRID_TEMPLATE }}
            whileHover={{ backgroundColor: "rgba(10,15,25,0.5)" }}
          >
            {/* ASSET */}
            <div className="font-medium text-slate-100 whitespace-nowrap">
              {r.ticker}
            </div>

            {/* HEADLINE + source */}
            {/* HEADLINE + source */}
                <div className="min-w-0 overflow-hidden">
                  <HoverText text={r.title}>
                    <div
                      className="text-sm text-slate-200 leading-snug"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,      // 👉 clamp to 2 lines
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {r.title}
                    </div>
                  </HoverText>

                  {r.source && (
                    <div className="mt-0.5 text-[11px] text-slate-500 truncate">
                      {r.source}
                    </div>
                  )}
</div>


            {/* MEDIAN */}
            <div
              className={`font-semibold whitespace-nowrap ${
                r.median > 0
                  ? "text-emerald-300"
                  : r.median < 0
                  ? "text-rose-300"
                  : "text-slate-300"
              }`}
            >
              {fmtPct(r.median)}
            </div>

            {/* RANGE */}
            <div className="text-slate-300 whitespace-nowrap">
              {fmtPct(r.p20)}{" "}
              <span className="text-slate-500">→</span>{" "}
              {fmtPct(r.p80)}
            </div>

            {/* CONFIDENCE */}
            <div className="text-slate-300 whitespace-nowrap">
              {Number.isFinite(r.confidence)
                ? Math.round(r.confidence)
                : "—"}
              %
            </div>

            {/* DATE (forecast created / article date if we have it later) */}
            <div className="text-slate-400 whitespace-nowrap">
              {r.date}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function normalizeRow(item) {
  const n = (x) => {
    const v = Number(x);
    return Number.isFinite(v) ? v : 0;
  };
  return {
    id:
      item.id ??
      item.forecast_id ??
      item.article_id ??
      `${(item.ticker || item.tickers || "UNK")}-${Math.random()}`,
    ticker: (item.ticker || item.tickers || "").toString().toUpperCase(),
    title: item.title || item.headline || "",
    source: item.source || "",
    median: n(item.p50 ?? item.median),
    p20: n(item.p20 ?? item.low),
    p80: n(item.p80 ?? item.high),
    confidence: n(item.confidence ?? item.calibrated_confidence),
    // prefer created_date, fall back to date/published_at
    date: (item.created_date || item.date || item.published_at || "")
      .toString()
      .slice(0, 10),
    raw: item,
  };
}

function fmtPct(x) {
  if (!Number.isFinite(x)) return "—";
  const sign = x > 0 ? "+" : "";
  return `${sign}${x.toFixed(1)}%`;
}

function HoverText({ text, children }) {
  return (
    <span className="relative group inline-block min-w-0">
      {children}
      <span
        className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-[36rem] max-w-[70vw]
                   rounded-md border border-slate-800 bg-slate-900/95 px-3 py-2 text-xs
                   text-slate-200 shadow-lg ring-1 ring-black/20 group-hover:block"
      >
        {text}
      </span>
    </span>
  );
}
