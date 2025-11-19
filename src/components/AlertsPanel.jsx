// src/components/AlertsPanel.jsx
import { useEffect, useState } from "react";
import { imiRepo } from "../api/imiRepo";

const USER_ID = "demo";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      const watchlists = await imiRepo.listWatchlists(USER_ID);
      const allTickers = new Set(
        watchlists.flatMap((w) => w.tickers || []).map((t) => t.toUpperCase())
      );
      if (allTickers.size === 0) {
        setAlerts([]);
        return;
      }

      const res = await imiRepo.runScreener({
        tickers: Array.from(allTickers),
        direction: null,
        minConfidence: 60, // hard-coded for now
        startDate: null,
        endDate: null,
      });

      setAlerts(res.signals.slice(0, 10));
    })();
  }, []);

  if (!alerts.length) return null;

  return (
    <div className="mb-4 rounded-2xl border border-amber-700/50 bg-amber-950/40 p-3 text-xs">
      <div className="text-amber-200 font-semibold mb-1">Watchlist alerts</div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {alerts.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-2 rounded-md border border-amber-800/70 bg-amber-950/50 px-2 py-1"
          >
            <div className="flex-1 text-[11px] text-amber-100">
              <span className="font-semibold">
                {String(s.ticker || s.tickers || "").toUpperCase()}
              </span>{" "}
              · {String(s.title || "").slice(0, 60)}
              {String(s.title || "").length > 60 ? "…" : ""}
            </div>
            <div className="text-[11px] text-amber-200">
              p50 {s.p50?.toFixed?.(2)}% · conf {s.confidence}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[10px] text-amber-300/80">
        Prototype alerts: based on your watchlist tickers and confidence ≥ 60%.
      </div>
    </div>
  );
}
