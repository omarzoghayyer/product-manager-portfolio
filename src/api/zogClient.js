// src/api/zogClient.js
import { insights as seedInsights } from "../data/insights";

/* ────────────────────────────────────────────
   Local storage seed for Insights
   ──────────────────────────────────────────── */
const STORAGE_KEY = "zog.insights";
const SEED_VERSION = 6;

function loadInsights() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.version === SEED_VERSION && Array.isArray(parsed.items)) {
        return parsed.items;
      }
    }
  } catch (e) {
    console.warn("Failed to read local storage, falling back to seed.", e);
  }
  const payload = { version: SEED_VERSION, items: seedInsights };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return seedInsights;
}

function saveInsights(items) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SEED_VERSION, items })
    );
  } catch (e) {
    console.warn("Failed to write local storage.", e);
  }
}

/* ────────────────────────────────────────────
   Backend wiring (FastAPI): forecast/analyze/receipts
   Uses:
     REACT_APP_API_URL   (e.g. http://127.0.0.1:8000)
     REACT_APP_API_PREFIX (default: /api)
   So the IMI Lab endpoint becomes:
     http://127.0.0.1:8000/api/forecast/news
   ──────────────────────────────────────────── */

const RAW_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

const RAW_PREFIX =
  typeof process !== "undefined"
    ? process.env.REACT_APP_API_PREFIX ?? "/api"
    : "/api";
const PREFIX = RAW_PREFIX === "/" ? "" : RAW_PREFIX || "/api";
const CLEAN_PREFIX = PREFIX.endsWith("/") ? PREFIX.slice(0, -1) : PREFIX;

// join base + prefix + path with exactly one slash between parts
function join(base, prefix, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${prefix}${p}`;
}

async function fetchJSON(path, { method = "GET", body, timeoutMs = 6000 } = {}) {
  if (!BASE) throw new Error("API not configured (REACT_APP_API_URL missing)");
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(join(BASE, CLEAN_PREFIX, path), {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText} ${text || ""}`.trim()
      );
    }
    return res.json();
  } finally {
    clearTimeout(to);
  }
}

/* ────────────────────────────────────────────
   IMI Lab: call FastAPI /api/forecast/news
   (News classifier endpoint)
   ──────────────────────────────────────────── */

/* ────────────────────────────────────────────
   IMI Lab: call FastAPI /api/forecast/news
   (News classifier endpoint)
   ──────────────────────────────────────────── */
const IMI_LAB_URL = "http://127.0.0.1:8000/api/forecast/news";

export async function forecastNews({ ticker, title, content }) {
  const res = await fetch(IMI_LAB_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker, title, content }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `forecastNews failed: ${res.status} ${text || ""}`.trim()
    );
  }

  return await res.json(); // {ticker, horizon_days, median_excess_pct, p20_excess_pct, p80_excess_pct, confidence}
}


/* ────────────────────────────────────────────
   Legacy forecast/analyze/receipts API
   ──────────────────────────────────────────── */

function neutralForecastFallback({ text = "", horizon_days = 5 }) {
  const note = text
    ? `Paraphrased: ${text.slice(0, 120)}${text.length > 120 ? "…" : ""
    }`
    : "Service offline; neutral placeholder.";
  return {
    forecast_id: "fc_fallback",
    imi: {
      asset: "MARKET",
      ticker: null,
      horizonDays: horizon_days,
      medianPct: 0.0,
      rangePct: [-0.4, 0.8],
      confidence: 0.56,
      modelVersion: "v0.fallback",
    },
    metrics: [],
    summary: note,
    sectors: [],
    assumptions: ["No exogenous shock within horizon"],
    risks: ["Policy surprise", "Liquidity shock"],
    drivers: [],
  };
}

function coerceForecastShape(fc) {
  if (!fc || !fc.imi) return null;
  const r = Array.isArray(fc.imi.rangePct) ? fc.imi.rangePct : [0, 0];
  return {
    ...fc,
    imi: {
      asset: fc.imi.asset ?? "MARKET",
      ticker: fc.imi.ticker ?? null,
      horizonDays: fc.imi.horizonDays ?? 10,
      medianPct: Number(fc.imi.medianPct ?? 0),
      rangePct: [Number(r[0] ?? 0), Number(r[1] ?? 0)],
      confidence: Number(fc.imi.confidence ?? 0.56),
      modelVersion: fc.imi.modelVersion ?? "v?",
    },
    metrics: Array.isArray(fc.metrics) ? fc.metrics : [],
  };
}

const api = {
  async forecast({ text, tickers = [], horizon_days = 10, source }) {
    try {
      const fc = await fetchJSON("forecast", {
        method: "POST",
        body: { text, tickers, horizon_days, source },
      });
      return (
        coerceForecastShape(fc) ??
        neutralForecastFallback({ text, horizon_days })
      );
    } catch (e) {
      console.warn("Forecast fallback (API unreachable):", e?.message || e);
      return neutralForecastFallback({ text, horizon_days });
    }
  },

  async analyze({ text }) {
    try {
      return await fetchJSON("analyze", {
        method: "POST",
        body: { text },
      });
    } catch (e) {
      console.warn("Analyze fallback (API unreachable):", e?.message || e);
      return {
        summary: text?.length
          ? `${text.slice(0, 180)}${text.length > 180 ? "…" : ""}`
          : "",
        keywords: [],
        sectors: [],
      };
    }
  },

  async receipt(forecast_id) {
    try {
      return await fetchJSON(`receipts/${forecast_id}`);
    } catch (e) {
      console.warn("Receipts fallback (API unreachable):", e?.message || e);
      return {
        forecast_id,
        coverage12m: 0.72,
        model_version: "v0.fallback",
        analogs: 0,
      };
    }
  },
};

/* ────────────────────────────────────────────
   Exported client (local entities + backend api)
   ──────────────────────────────────────────── */
export const zog = {
  api,
  entities: {
    Insight: {
      async list(order = "-created_date") {
        const items = loadInsights();
        if (order === "-created_date") {
          return [...items].sort(
            (a, b) =>
              new Date(b.created_date) - new Date(a.created_date)
          );
        }
        return items;
      },
      async filter(query = {}) {
        const items = loadInsights();
        if (query.id) return items.filter((i) => i.id === query.id);
        return [];
      },
      async update(id, patch = {}) {
        const items = loadInsights();
        const idx = items.findIndex((i) => i.id === id);
        if (idx === -1) throw new Error("Insight not found");
        const updated = { ...items[idx], ...patch };
        items[idx] = updated;
        saveInsights(items);
        return updated;
      },
      async create(item) {
        const items = loadInsights();
        items.push(item);
        saveInsights(items);
        return item;
      },
    },
  },
};

export default zog;
