// src/components/Screener.jsx
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { imiRepo } from "../api/imiRepo";
import { impactMocks } from "../data/impactMocks";

const SEED_IMPACT = impactMocks;

export default function Screener() {
  const [form, setForm] = useState({
    tickers: [],
    direction: "all",
    minConfidence: 0,
    window: "90d", // just for UX, we’ll map to dates
  });

  const [tickersUniverse, setTickersUniverse] = useState([]);

  // Seed and load signals for ticker universe
  useEffect(() => {
    (async () => {
      await imiRepo.seedSignals(SEED_IMPACT);
      const all = await imiRepo.listSignals();
      const setTickers = new Set(
        all
          .map((s) => String(s.ticker || s.tickers || "").toUpperCase())
          .filter(Boolean)
      );
      setTickersUniverse(Array.from(setTickers).sort());
    })();
  }, []);

  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const { startDate, endDate } = resolveWindow(form.window);
      const res = await imiRepo.runScreener({
        tickers: form.tickers,
        direction: form.direction === "all" ? null : form.direction,
        minConfidence: form.minConfidence || null,
        startDate,
        endDate,
      });
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8 text-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        IMI Screener & Backtest (Local Data)
      </h1>
      <p className="text-sm text-slate-400 mb-4">
        Run quick stats over your current IMI signals. Later this will hit the real DB.
      </p>

      {/* Controls */}
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        {/* Tickers */}
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-400 mb-1">Tickers</label>
          <select
            multiple
            value={form.tickers}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              setForm((f) => ({ ...f, tickers: selected }));
            }}
            className="w-full h-24 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs outline-none"
          >
            {tickersUniverse.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">
            Leave empty to include all tickers.
          </p>
        </div>

        {/* Direction */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Direction</label>
          <select
            value={form.direction}
            onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value }))}
            className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs outline-none"
          >
            <option value="all">All</option>
            <option value="up">Up only</option>
            <option value="down">Down only</option>
          </select>
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Min confidence (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.minConfidence}
            onChange={(e) =>
              setForm((f) => ({ ...f, minConfidence: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs outline-none"
          />
          <label className="block text-xs text-slate-400 mt-2 mb-1">Window</label>
          <select
            value={form.window}
            onChange={(e) => setForm((f) => ({ ...f, window: e.target.value }))}
            className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs outline-none"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="365d">Last 365 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleRun}
        disabled={isRunning}
        className="rounded-md border border-emerald-600 bg-emerald-700/80 px-3 py-1.5 text-xs font-semibold text-slate-50 hover:bg-emerald-600 disabled:opacity-50"
      >
        {isRunning ? "Running..." : "Run screener"}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-3">
          <div className="grid gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <div className="text-slate-500">Matches</div>
              <div className="mt-1 text-lg font-semibold text-slate-100">
                {result.count}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <div className="text-slate-500">Avg excess return</div>
              <div className="mt-1 text-lg font-semibold text-slate-100">
                {result.avg_excess != null ? `${result.avg_excess.toFixed(2)}%` : "—"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <div className="text-slate-500">Std dev (excess)</div>
              <div className="mt-1 text-lg font-semibold text-slate-100">
                {result.std_excess != null ? `${result.std_excess.toFixed(2)}%` : "—"}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
            <div className="mb-2 text-slate-400">
              Sample of matching signals (up to 20):
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {result.signals.slice(0, 20).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1"
                >
                  <div className="flex-1">
                    <div className="text-slate-200 text-[11px]">
                      <span className="font-semibold">
                        {String(s.ticker || s.tickers || "").toUpperCase()}
                      </span>{" "}
                      · {String(s.title || "").slice(0, 60)}
                      {String(s.title || "").length > 60 ? "…" : ""}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      p50 {s.p50?.toFixed?.(2) ?? s.p50}% · conf {s.confidence}%
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {s.realized_excess_return != null
                      ? `${s.realized_excess_return.toFixed(2)}%`
                      : "n/a"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function resolveWindow(label) {
  if (label === "all") return { startDate: null, endDate: null };
  const now = new Date();
  const msDay = 24 * 60 * 60 * 1000;
  let days = 90;
  if (label === "30d") days = 30;
  if (label === "365d") days = 365;
  const start = new Date(now.getTime() - days * msDay);
  return { startDate: start.toISOString(), endDate: now.toISOString() };
}
