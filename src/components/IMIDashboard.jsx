// src/components/IMIDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MarketTable from "./MarketTable";
import InsightCard from "./InsightCard";
import FiltersBar from "./FiltersBar";
import { imiRepo } from "../api/imiRepo"; // 👈 fake DB / localStorage layer
import { impactMocks } from "../data/impactMocks";

const SEED_IMPACT = impactMocks;

function getCutoff(now, windowKey) {
  const msDay = 24 * 60 * 60 * 1000;
  switch (windowKey) {
    case "24h":
      return new Date(now.getTime() - msDay);
    case "7d":
      return new Date(now.getTime() - 7 * msDay);
    case "30d":
      return new Date(now.getTime() - 30 * msDay);
    case "all":
    default:
      return null;
  }
}

function getDate(obj) {
  const s = obj.created_date || obj.date || obj.published_at;
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getImpactScore(row) {
  const p50 = Number(row.p50 ?? row.median ?? 0);
  const conf = Number(row.confidence ?? row.calibrated_confidence ?? 0);
  const conf01 = Number.isFinite(conf) ? conf / 100 : 0;
  return Math.abs(Number.isFinite(p50) ? p50 : 0) * conf01;
}

export default function IMIDashboard() {
  const {
    data: rawData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["imi_feed"],
    queryFn: async () => {
      await imiRepo.seedSignals(SEED_IMPACT);   // only seeds if empty
      return imiRepo.listSignals();            // always reads latest
    },
  });

  // --- Filters state ---
  const [filters, setFilters] = useState({
    search: "",
    tickers: [],
    minConf: 0,
    direction: "all",
  });

  const [selected, setSelected] = useState(null);
  const [dateWindow, setDateWindow] = useState("7d"); // "24h" | "7d" | "30d" | "all"
  const [sortMode, setSortMode] = useState("impact"); // "impact" | "confidence" | "newest"

  // --- Derived ticker options for FiltersBar ---
  const tickerOptions = useMemo(() => {
    const s = new Set(
      (rawData || [])
        .map((d) => String(d.ticker || d.tickers || "").toUpperCase())
        .filter(Boolean)
    );
    return Array.from(s).sort();
  }, [rawData]);

  // --- Apply FiltersBar filters ---
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return (rawData || []).filter((row) => {
      const ticker = String(row.ticker || row.tickers || "").toUpperCase();
      const title = String(row.title || row.headline || "");
      const p50 = Number(row.p50 ?? row.median);
      const conf = Number(row.confidence ?? row.calibrated_confidence);

      // search (title or ticker)
      if (q) {
        const hit =
          title.toLowerCase().includes(q) ||
          ticker.toLowerCase().includes(q);
        if (!hit) return false;
      }

      // tickers (multi)
      if (filters.tickers?.length) {
        if (!filters.tickers.includes(ticker)) return false;
      }

      // min confidence
      if (Number.isFinite(filters.minConf) && filters.minConf > 0) {
        if (!Number.isFinite(conf) || conf < filters.minConf) return false;
      }

      // direction filter
      if (filters.direction !== "all") {
        const dir = p50 > 0 ? "up" : p50 < 0 ? "down" : "flat";
        if (dir !== filters.direction) return false;
      }

      return true;
    });
  }, [rawData, filters]);

  // --- Apply date window + sort mode + build stats/trending ---
  const { finalData, headerStats, trendingTickers, topSources } = useMemo(() => {
    const now = new Date();
    const cutoff = getCutoff(now, dateWindow);

    const inWindow = filtered.filter((row) => {
      if (!cutoff) return true;
      const d = getDate(row);
      if (!d) return false;
      return d >= cutoff;
    });

    // sort
    const sorted = [...inWindow].sort((a, b) => {
      if (sortMode === "confidence") {
        const ca = Number(a.confidence ?? a.calibrated_confidence ?? 0);
        const cb = Number(b.confidence ?? b.calibrated_confidence ?? 0);
        return cb - ca;
      }
      if (sortMode === "newest") {
        const da = getDate(a);
        const db = getDate(b);
        const ta = da ? da.getTime() : 0;
        const tb = db ? db.getTime() : 0;
        return tb - ta;
      }
      // default: "impact"
      const sa = getImpactScore(a);
      const sb = getImpactScore(b);
      return sb - sa;
    });

    const total = rawData?.length || 0;
    const shown = sorted.length;
    const windowLabel =
      dateWindow === "24h"
        ? "Last 24h"
        : dateWindow === "7d"
        ? "Last 7 days"
        : dateWindow === "30d"
        ? "Last 30 days"
        : "All time";

    // strongest + highest conf
    let strongest = null;
    let highestConf = null;
    for (const row of sorted) {
      const score = getImpactScore(row);
      const conf = Number(row.confidence ?? row.calibrated_confidence ?? 0);
      if (!strongest || score > strongest.score) {
        strongest = { row, score };
      }
      if (!highestConf || conf > highestConf.conf) {
        highestConf = { row, conf };
      }
    }

    const headerStats = {
      total,
      shown,
      windowLabel,
      strongest: strongest?.row || null,
      highestConf: highestConf?.row || null,
    };

    // trending tickers
    const tickerAgg = new Map();
    for (const row of inWindow) {
      const t = String(row.ticker || row.tickers || "").toUpperCase() || "UNK";
      const impact = Number(row.p50 ?? row.median ?? 0);
      const prev = tickerAgg.get(t) || { count: 0, sumAbsImpact: 0 };
      tickerAgg.set(t, {
        count: prev.count + 1,
        sumAbsImpact:
          prev.sumAbsImpact + Math.abs(Number.isFinite(impact) ? impact : 0),
      });
    }
    const trendingTickers = Array.from(tickerAgg.entries())
      .map(([ticker, v]) => ({
        ticker,
        count: v.count,
        avgAbsImpact: v.count ? v.sumAbsImpact / v.count : 0,
      }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.avgAbsImpact - a.avgAbsImpact;
      })
      .slice(0, 3);

    // top sources (guard against invalid URLs)
    const sourceAgg = new Map();
    for (const row of inWindow) {
      let source = "";
      if (row.source) {
        source = String(row.source).trim();
      } else if (row.url) {
        try {
          source = new URL(row.url).hostname;
        } catch {
          source = "";
        }
      }
      if (!source) continue;
      const prev = sourceAgg.get(source) || { count: 0, sumImpactScore: 0 };
      sourceAgg.set(source, {
        count: prev.count + 1,
        sumImpactScore: prev.sumImpactScore + getImpactScore(row),
      });
    }
    const topSources = Array.from(sourceAgg.entries())
      .map(([source, v]) => ({
        source,
        count: v.count,
        avgImpactScore: v.count ? v.sumImpactScore / v.count : 0,
      }))
      .sort((a, b) => b.avgImpactScore - a.avgImpactScore)
      .slice(0, 3);

    return { finalData: sorted, headerStats, trendingTickers, topSources };
  }, [filtered, rawData, dateWindow, sortMode]);

  // If current selection is filtered out, clear it
  useEffect(() => {
    if (!selected) return;
    const stillThere = finalData.some((d) => d.id === selected.id);
    if (!stillThere) setSelected(null);
  }, [finalData, selected]);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 text-slate-200">
      <Header
        stats={headerStats}
        dateWindow={dateWindow}
        setDateWindow={setDateWindow}
        sortMode={sortMode}
        setSortMode={setSortMode}
        trendingTickers={trendingTickers}
        topSources={topSources}
      />

      {/* Filters */}
      <div className="mb-4">
        <FiltersBar
          values={filters}
          onChange={setFilters}
          stats={{ total: rawData?.length || 0, shown: finalData.length }}
          options={{ tickers: tickerOptions }}
        />
      </div>

      {/* Errors */}
      {error && (
        <div className="mt-4 rounded-xl border border-rose-800/40 bg-rose-950/30 p-3 text-rose-200">
          Failed to load IMI feed. {String(error.message || error)}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MarketTable items={finalData} onSelect={setSelected} />
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h4 className="text-sm font-semibold text-slate-200">
                Selection
              </h4>
              <p className="text-xs text-slate-400">
                Tap a row to preview the AI analysis.
              </p>
            </div>

            {selected ? (
              <InsightCard item={selected} />
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-slate-400">
                No item selected.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Local components ---------- */
function Header({
  stats,
  dateWindow,
  setDateWindow,
  sortMode,
  setSortMode,
  trendingTickers,
  topSources,
}) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Market Impact (IMI)
          </h1>
          <p className="text-sm text-slate-400">
            Signal-first dashboard. 10-day outlook. Live updates.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>Live</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <select
              value={dateWindow}
              onChange={(e) => setDateWindow(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-emerald-500/40"
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-emerald-500/40"
            >
              <option value="impact">Most impactful</option>
              <option value="confidence">Highest confidence</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick stats + trending */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
          <div className="text-slate-500">Signals</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-slate-100">
              {stats.shown}
            </span>
            <span className="text-[11px] text-slate-500">
              {stats.windowLabel.toLowerCase()} / {stats.total} total
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
          <div className="text-slate-500">Strongest signal</div>
          {stats.strongest ? (
            <div className="mt-1 text-slate-200">
              <span className="font-semibold">
                {(stats.strongest.ticker || "").toUpperCase() || "—"}
              </span>{" "}
              ·{" "}
              <span>
                {String(stats.strongest.title || "").slice(0, 60)}
                {String(stats.strongest.title || "").length > 60 ? "…" : ""}
              </span>
            </div>
          ) : (
            <div className="mt-1 text-slate-500">None in window</div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
          <div className="text-slate-500">Trending now</div>
          {trendingTickers.length ? (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {trendingTickers.map((t) => (
                <span
                  key={t.ticker}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[11px]"
                >
                  <span className="text-slate-100">{t.ticker}</span>
                  <span className="text-slate-500">· {t.count}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-1 text-slate-500">No strong trend</div>
          )}
        </div>
      </div>

      {/* Sources mini-panel */}
      {topSources.length > 0 && (
        <div className="mt-2 text-xs text-slate-500">
          Sources:{" "}
          {topSources.map((s, idx) => (
            <span key={s.source}>
              {idx > 0 && <span className="mx-1 text-slate-700">•</span>}
              <span className="text-slate-300">{s.source}</span>{" "}
              <span className="text-slate-500">({s.count} signals)</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 h-64 animate-pulse rounded-2xl bg-slate-900/50" />
      <div className="lg:col-span-1 h-64 animate-pulse rounded-2xl bg-slate-900/50" />
    </div>
  );
}
