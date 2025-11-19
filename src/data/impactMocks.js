// src/data/impactMocks.js
export const impactByInsightId = {
  "market-impact-card-explainer": {
    summary:
      "Standardizing a 10-day horizon with median move and calibrated range builds trust and comparability.",
    sectors: ["Product", "Markets"],
    source: { title: "Internal explainer", url: "#", publishedAt: "2025-10-27" },
    imi: {
      asset: "S&P 500",
      ticker: "^GSPC",
      medianPct: -0.2,
      rangePct: [-0.9, 0.3],
      horizonDays: 10,
      confidence: 0.6,
      analogCount: 124,
      modelVersion: "imi-1.0.0",
    },
    metrics: [
      {
        asset: "SOXX",
        ticker: "SOXX",
        direction: "down",
        medianPct: -0.8,
        rangePct: [-1.8, 0.2],
        horizonDays: 10,
        confidence: 0.58,
        drivers: ["tightening liquidity"],
        flipRisks: ["soft CPI"],
        analogCount: 88,
        modelVsMarketDeltaPct: -0.3,
      },
    ],
    assumptions: ["No major policy surprise", "Vol in recent band"],
    risks: ["Upside CPI miss", "Dovish central-bank commentary"],
    nextCheckInDate: "2025-11-10",
    overallReceiptUrl: "/receipts/mock-001",
    accuracyRibbon: { label: "Last 90d coverage", valuePct: 66 },
  },

  // Example for another insight id (edit to match yours)
  "economic-view-toolkit": {
    summary:
      "Economic-view checklist helps quantify costs/benefits and set expectations for market reaction windows.",
    sectors: ["Decision-making", "Economics"],
    source: { title: "Economic View", url: "#", publishedAt: "2025-10-27" },
    imi: {
      asset: "S&P 500",
      ticker: "^GSPC",
      medianPct: 0.1,
      rangePct: [-0.4, 0.6],
      horizonDays: 10,
      confidence: 0.55,
      analogCount: 72,
      modelVersion: "imi-1.0.0",
    },
    metrics: [],
    assumptions: ["No new macro shocks"],
    risks: ["Unexpected policy shift"],
    nextCheckInDate: "2025-11-10",
    overallReceiptUrl: "/receipts/mock-002",
    accuracyRibbon: { label: "Last 90d coverage", valuePct: 66 },
  },
};

export const impactMocks = [
  {
    id: "1",
    date: "2025-11-10",
    title: "Apple announces record iPhone sales in Q4 earnings",
    ticker: "AAPL",
    p20: -0.8,
    p50: 1.2,
    p80: 3.4,
    confidence: 72,
    drivers: "Earnings, Demand, Supply Chain",
    summary:
      "Apple reported record Q4 iPhone revenue with strong upgrade demand. Analysts raised FY26 forecasts as margins remained stable.",
  },
  {
    id: "2",
    date: "2025-11-08",
    title: "Tesla expands energy storage production in Texas",
    ticker: "TSLA",
    p20: -0.5,
    p50: 0.9,
    p80: 2.1,
    confidence: 61,
    drivers: "Expansion, CapEx, Margins",
    summary:
      "Tesla announced new capacity additions for its Megapack facility, signaling long-term growth in its energy segment.",
  },
];
