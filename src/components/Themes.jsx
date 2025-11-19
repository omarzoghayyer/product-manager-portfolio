import { useQuery } from "@tanstack/react-query";
import { imiRepo } from "../api/imiRepo";
import { Link } from "react-router-dom";

export function Themes() {
  const { data: themes = [] } = useQuery({
    queryKey: ["themes"],
    queryFn: () => imiRepo.listThemes(),
  });

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8 text-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Themes</h1>
      <p className="text-sm text-slate-400 mb-4">
        Pre-bucketed narratives like AI chips, mega-cap tech, etc.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {themes.map((t) => (
          <Link
            key={t.id}
            to={`/themes/${t.slug}`}
            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs hover:border-emerald-500/60"
          >
            <div className="text-slate-100 font-semibold">{t.name}</div>
            <div className="mt-1 text-slate-400">{t.description}</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Tickers: {t.tickers.join(", ")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
