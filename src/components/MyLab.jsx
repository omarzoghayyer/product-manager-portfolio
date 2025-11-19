// src/components/MyLab.jsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { imiRepo } from "../api/imiRepo";

const USER_ID = "demo";

export default function MyLab() {
  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ["my_lab_analyses", USER_ID],
    queryFn: () => imiRepo.listUserAnalyses(USER_ID),
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["my_lab_stats", USER_ID],
    queryFn: () => imiRepo.getUserStats(USER_ID),
  });

  // 🔍 TEMP: log what actually comes back
  useEffect(() => {
    if (analyses.length > 0) {
      // eslint-disable-next-line no-console
      console.log("MyLab sample analysis:", analyses[0]);
    }
  }, [analyses]);

  // Prefer the actual rows first; if nothing is loaded, fall back to stats.count
  const analysesRun =
    (analyses && analyses.length ? analyses.length : 0) ||
    (typeof stats.count === "number" ? stats.count : 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        {/* Page header */}
        <header className="mb-4">
          <h1 className="text-[20px] font-semibold tracking-tight text-slate-50">
            My IMI Lab
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Personal history of analyses and how your intuition compares to the model.
          </p>
        </header>

        {/* Stats row */}
        <div className="grid gap-3 md:grid-cols-3 mb-6 text-[11px]">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">
              Analyses run
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              {isLoading || statsLoading ? "…" : analysesRun}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">
              Model MAE (excess %)
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              {statsLoading || stats.model_mae == null
                ? "—"
                : stats.model_mae.toFixed(2)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">
              Your MAE (excess %)
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              {statsLoading || stats.user_mae == null
                ? "—"
                : stats.user_mae.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
          <div className="mb-2 text-[11px] text-slate-400">Recent analyses</div>

          {isLoading ? (
            <div className="h-32 animate-pulse rounded-xl bg-slate-950/60" />
          ) : analyses.length === 0 ? (
            <div className="text-slate-500 text-[11px]">
              No analyses logged yet. Run something in IMI Lab.
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              <table className="min-w-full border-collapse">
                <thead className="sticky top-0 bg-slate-950/95">
                  <tr className="text-[11px] text-slate-500 border-b border-slate-800">
                    <th className="text-left px-2 py-1 font-normal">Date</th>
                    <th className="text-left px-2 py-1 font-normal">Ticker</th>
                    <th className="text-left px-2 py-1 font-normal">Title</th>
                    <th className="text-right px-2 py-1 font-normal">
                      Model p50
                    </th>
                    <th className="text-right px-2 py-1 font-normal">
                      Your guess
                    </th>
                    <th className="text-right px-2 py-1 font-normal">
                      Realized
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((a) => (
                    <MyLabRow key={a.id} analysis={a} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MyLabRow({ analysis }) {
  const date = analysis.run_at || analysis.created_at;
  const d = date ? new Date(date) : null;
  const dateStr = d ? d.toISOString().slice(0, 10) : "—";

  const signal = analysis.signal || analysis.insight || {};

  const tickerRaw =
    analysis.ticker ??
    analysis.asset ??
    analysis.symbol ??
    signal.ticker ??
    signal.asset ??
    "";
  const ticker = String(tickerRaw).toUpperCase();

  const title =
    analysis.title ??
    analysis.headline ??
    analysis.news_title ??
    signal.title ??
    signal.headline ??
    "";

  const modelP50Raw =
    analysis.p50 ??
    analysis.model_p50 ??
    analysis.model_p50_excess ??
    analysis.median_excess_pct ??
    analysis.medianPct ??
    signal.p50 ??
    signal.model_p50 ??
    signal.median_excess_pct ??
    signal.medianPct;

  const modelP50 =
    modelP50Raw == null ? "—" : `${Number(modelP50Raw).toFixed(2)}%`;

  const userGuessRaw =
    analysis.user_guess_p50 ??
    analysis.user_guess ??
    analysis.guess_p50 ??
    analysis.guess ??
    analysis.userGuessP50;
  const userGuess =
    userGuessRaw == null ? "—" : `${Number(userGuessRaw).toFixed(2)}%`;

  const realizedRaw =
    analysis.realized_excess_return ??
    analysis.realized_excess_pct ??
    analysis.realizedPct ??
    analysis.realized_excess ??
    signal.realized_excess_pct;

  const realizedStr =
    realizedRaw == null ? "n/a" : `${Number(realizedRaw).toFixed(2)}%`;

  let realizedClass = "text-slate-300";
  if (realizedRaw != null) {
    if (realizedRaw > 0) realizedClass = "text-emerald-400";
    else if (realizedRaw < 0) realizedClass = "text-rose-400";
  }

  return (
    <tr className="border-b border-slate-900/70">
      <td className="px-2 py-1 text-[11px] text-slate-400">{dateStr}</td>
      <td className="px-2 py-1 text-[11px] font-semibold text-slate-100">
        {ticker}
      </td>
      <td className="px-2 py-1 text-[11px] text-slate-300">
        {String(title).slice(0, 60)}
        {String(title).length > 60 ? "…" : ""}
      </td>
      <td className="px-2 py-1 text-[11px] text-right text-slate-300">
        {modelP50}
      </td>
      <td className="px-2 py-1 text-[11px] text-right text-slate-300">
        {userGuess}
      </td>
      <td className={`px-2 py-1 text-[11px] text-right ${realizedClass}`}>
        {realizedStr}
      </td>
    </tr>
  );
}
