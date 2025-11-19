import React from "react";
import { ArrowBadge } from "./ImpactCard"; // uses the squiggly arrow style from ImpactCard

const pct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
const conf = (c) => `${Math.round((c ?? 0) * 100)}%`;
const cls = (...a) => a.filter(Boolean).join(" ");

export default function MarketImpactPanel({
  title = "Market Impact Analysis",
  impact,
}) {
  if (!impact) return null;

  const imi = impact.imi || {};
  const sectors = impact.sectors || [];
  const metrics = impact.metrics || [];
  const assumptions = impact.assumptions || [];
  const risks = impact.risks || [];
  const summary = impact.summary || "";
  const horizon = imi.horizonDays || 30;

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-lg shadow-sm">
          ✦
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <div className="text-sm text-gray-500">AI-powered prediction • {horizon}-day outlook</div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border rounded-2xl p-5 mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">Summary</div>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* Sectors */}
      <div className="bg-white border rounded-2xl p-5 mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-3">Affected Sectors</div>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <span key={s} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{s}</span>
          ))}
          {!sectors.length && <span className="text-sm text-gray-500">—</span>}
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-4">
        <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Predictions</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">ASSET</th>
                <th className="text-left px-4 py-3">DIRECTION</th>
                <th className="text-left px-4 py-3">RANGE</th>
                <th className="text-left px-4 py-3">CONFIDENCE</th>
                <th className="text-left px-4 py-3">KEY DRIVERS</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => {
                const low = m.rangePct?.[0] ?? 0;
                const high = m.rangePct?.[1] ?? 0;
                return (
                  <tr key={`${m.asset}-${i}`} className="border-t">
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {m.asset}{m.ticker ? ` • ${m.ticker}` : ""}
                    </td>
                    <td className="px-4 py-4">
                      <ArrowBadge value={m.medianPct ?? 0} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {pct(low)} <span className="text-gray-400">to</span> {pct(high)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-900 font-medium">{conf(m.confidence)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(m.drivers || []).map((d, j) => (
                          <span key={j} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                            {d}
                          </span>
                        ))}
                        {(!m.drivers || !m.drivers.length) && <span className="text-gray-400">—</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!metrics.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No predictions.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-600 font-semibold">Assumptions</span>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-2">
            {assumptions.length
              ? assumptions.map((a, i) => <li key={i}>{a}</li>)
              : <li className="text-gray-500">—</li>}
          </ul>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-600">▲</span>
            <span className="text-gray-600 font-semibold">Risks</span>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-2">
            {risks.length
              ? risks.map((r, i) => <li key={i}>{r}</li>)
              : <li className="text-gray-500">—</li>}
          </ul>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="mt-4">
        <div className="bg-white border rounded-2xl p-4 text-xs text-gray-500 text-center">
          This analysis is AI-generated based on article content. Not financial advice. Do your own research.
        </div>
      </div>
    </section>
  );
}
