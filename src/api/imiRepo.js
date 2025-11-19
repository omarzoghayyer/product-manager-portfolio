// src/api/imiRepo.js
// Thin repo over localStorage + one real API call to the backend.

const STORAGE_KEYS = {
    signals: "imi.signals.v1",
    userAnalyses: "imi.userAnalyses.v1",
    watchlists: "imi.watchlists.v1",
    clusters: "imi.clusters.v1",
    themes: "imi.themes.v1",
};

// Backend base URL (set REACT_APP_API_BASE in .env if you want to override)
const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:8000";

function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch (e) {
        console.warn("imiRepo load failed for", key, e);
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("imiRepo save failed for", key, e);
    }
}

// Simple id helper (good enough for fake DB)
function makeId(prefix = "imi") {
    return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

/**
 * IMI signal shape (what the dashboard expects)
 * {
 *   id, ticker, title, url, source,
 *   p20, p50, p80, confidence,
 *   horizon_days, created_date,
 *   realized_excess_return, realized_at
 * }
 */

export const imiRepo = {
    // -------- Live model call (news classifier) --------
    async forecastNews({ ticker, title, content }) {
        const payload = {
            ticker,
            title,
            content: content || "",
        };

        const resp = await fetch(`${API_BASE}/forecast/news`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(
                `forecastNews failed: ${resp.status} ${resp.statusText} – ${text}`,
            );
        }

        // Backend returns NewsForecastResponse:
        // { ticker, title, horizon_days, prob_up, prob_down, class_threshold, suggested_action }
        return await resp.json();
    },

    // -------- Signals (global feed) --------
    async listSignals() {
        return load(STORAGE_KEYS.signals, []);
    },

    async seedSignals(seedArray) {
        // One-time seeding helper
        const existing = load(STORAGE_KEYS.signals, []);
        if (existing.length === 0 && Array.isArray(seedArray)) {
            save(STORAGE_KEYS.signals, seedArray);
            return seedArray;
        }
        return existing;
    },

    async upsertSignal(signal) {
        const all = load(STORAGE_KEYS.signals, []);
        let updated = false;
        const withId = { id: signal.id || makeId("sig"), ...signal };

        const next = all.map((s) => {
            if (s.id === withId.id) {
                updated = true;
                return { ...s, ...withId };
            }
            return s;
        });

        if (!updated) next.push(withId);
        save(STORAGE_KEYS.signals, next);
        return withId;
    },

    async getSignalById(id) {
        const all = load(STORAGE_KEYS.signals, []);
        return all.find((s) => s.id === id) || null;
    },

    // -------- User Analyses (IMI Lab runs) --------
    async listUserAnalyses(userId = "demo") {
        const all = load(STORAGE_KEYS.userAnalyses, []);
        return all.filter((a) => a.user_id === userId);
    },

    async addUserAnalysis(userId = "demo", payload) {
        const allSignals = load(STORAGE_KEYS.signals, []);
        let signal = payload.signal;

        // If we were passed a signal object, ensure it's stored
        if (signal && !signal.id) {
            signal = await this.upsertSignal(signal);
        }

        const entry = {
            id: makeId("ua"),
            user_id: userId,
            signal_id: signal?.id || payload.signal_id,
            user_guess_p50: payload.user_guess_p50 ?? null,
            notes: payload.notes ?? "",
            tags: payload.tags ?? [],
            created_at: new Date().toISOString(),
        };

        const all = load(STORAGE_KEYS.userAnalyses, []);
        all.unshift(entry);
        save(STORAGE_KEYS.userAnalyses, all);
        return entry;
    },

    // Very light “calibration” stats for the current user
    async getUserStats(userId = "demo") {
        const analyses = await this.listUserAnalyses(userId);
        const signals = load(STORAGE_KEYS.signals, []);
        const byId = new Map(signals.map((s) => [s.id, s]));

        let n = 0;
        let modelAbsErrSum = 0;
        let userAbsErrSum = 0;

        for (const a of analyses) {
            const s = byId.get(a.signal_id);
            if (!s) continue;
            if (s.realized_excess_return == null) continue;
            if (a.user_guess_p50 == null) continue;

            const realized = Number(s.realized_excess_return);
            const modelGuess = Number(s.p50);
            const userGuess = Number(a.user_guess_p50);

            if (
                !Number.isFinite(realized) ||
                !Number.isFinite(modelGuess) ||
                !Number.isFinite(userGuess)
            ) {
                continue;
            }

            n += 1;
            modelAbsErrSum += Math.abs(realized - modelGuess);
            userAbsErrSum += Math.abs(realized - userGuess);
        }

        return {
            count: n,
            model_mae: n ? modelAbsErrSum / n : null,
            user_mae: n ? userAbsErrSum / n : null,
        };
    },

    // -------- Watchlists (per user, ticker only for now) --------
    async listWatchlists(userId = "demo") {
        const all = load(STORAGE_KEYS.watchlists, []);
        return all.filter((w) => w.user_id === userId);
    },

    async saveWatchlist(userId = "demo", { id, name, tickers }) {
        const all = load(STORAGE_KEYS.watchlists, []);
        const wl = {
            id: id || makeId("wl"),
            user_id: userId,
            name,
            tickers: tickers || [],
            created_at: new Date().toISOString(),
        };

        const next = all.filter((w) => w.id !== wl.id);
        next.push(wl);
        save(STORAGE_KEYS.watchlists, next);
        return wl;
    },

    // -------- Clusters (manual event bundles) --------
    async listClusters() {
        return load(STORAGE_KEYS.clusters, []);
    },

    async createCluster({ name, description, signalIds = [] }) {
        const all = load(STORAGE_KEYS.clusters, []);
        const cluster = {
            id: makeId("clu"),
            name,
            description: description || "",
            signal_ids: signalIds,
            created_at: new Date().toISOString(),
        };
        all.push(cluster);
        save(STORAGE_KEYS.clusters, all);
        return cluster;
    },

    async addSignalToCluster(clusterId, signalId) {
        const all = load(STORAGE_KEYS.clusters, []);
        const next = all.map((c) =>
            c.id === clusterId
                ? {
                    ...c,
                    signal_ids: Array.from(
                        new Set([...(c.signal_ids || []), signalId]),
                    ),
                }
                : c,
        );
        save(STORAGE_KEYS.clusters, next);
        return next.find((c) => c.id === clusterId) || null;
    },

    // -------- Themes (static-ish for now) --------
    async listThemes() {
        // if nothing in storage, seed with a few examples
        let themes = load(STORAGE_KEYS.themes, null);
        if (!themes) {
            themes = [
                {
                    id: makeId("th"),
                    slug: "ai-chips",
                    name: "AI Chips",
                    description:
                        "NVIDIA, AMD, TSM, AVGO and related semiconductor names.",
                    tickers: ["NVDA", "AMD", "TSM", "AVGO"],
                },
                {
                    id: makeId("th"),
                    slug: "megacap-tech",
                    name: "Mega-cap Tech",
                    description: "AAPL, MSFT, AMZN, META, GOOGL, TSLA.",
                    tickers: ["AAPL", "MSFT", "AMZN", "META", "GOOGL", "TSLA"],
                },
            ];
            save(STORAGE_KEYS.themes, themes);
        }
        return themes;
    },

    async getThemeBySlug(slug) {
        const themes = await this.listThemes();
        return themes.find((t) => t.slug === slug) || null;
    },

    async listSignalsForTheme(slug) {
        const theme = await this.getThemeBySlug(slug);
        if (!theme) return [];
        const all = load(STORAGE_KEYS.signals, []);
        const set = new Set(theme.tickers.map((t) => t.toUpperCase()));
        return all.filter((s) =>
            set.has(String(s.ticker || s.tickers || "").toUpperCase()),
        );
    },

    // -------- Client-side screener/backtest (on whatever data we have) --------
    async runScreener({ tickers, direction, minConfidence, startDate, endDate }) {
        const all = load(STORAGE_KEYS.signals, []);
        const tickerSet =
            tickers && tickers.length
                ? new Set(tickers.map((t) => t.toUpperCase()))
                : null;

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const filtered = all.filter((s) => {
            const t = String(s.ticker || s.tickers || "").toUpperCase();
            if (tickerSet && !tickerSet.has(t)) return false;

            const conf = Number(s.confidence ?? 0);
            if (minConfidence != null && Number.isFinite(minConfidence)) {
                if (!Number.isFinite(conf) || conf < minConfidence) return false;
            }

            const p50 = Number(s.p50 ?? s.median);
            if (direction === "up" && !(p50 > 0)) return false;
            if (direction === "down" && !(p50 < 0)) return false;

            const d = s.created_date ? new Date(s.created_date) : null;
            if (start && (!d || d < start)) return false;
            if (end && (!d || d >= end)) return false;

            if (s.realized_excess_return == null) return false;

            return true;
        });

        let n = 0;
        let sum = 0;
        let sumSq = 0;
        for (const s of filtered) {
            const r = Number(s.realized_excess_return);
            if (!Number.isFinite(r)) continue;
            n += 1;
            sum += r;
            sumSq += r * r;
        }
        const avg = n ? sum / n : null;
        const variance = n ? sumSq / n - (avg ?? 0) ** 2 : null;
        const std =
            variance != null && variance >= 0 ? Math.sqrt(variance) : null;

        return {
            count: n,
            avg_excess: avg,
            std_excess: std,
            signals: filtered,
        };
    },
};
