import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { imiRepo } from "../api/imiRepo";
import MarketTable from "./MarketTable";

export function ThemeDetail() {
  const { slug } = useParams();

  const { data: theme } = useQuery({
    queryKey: ["theme_meta", slug],
    queryFn: () => imiRepo.getThemeBySlug(slug),
  });

  const { data: signals = [], isLoading } = useQuery({
    queryKey: ["theme_signals", slug],
    queryFn: () => imiRepo.listSignalsForTheme(slug),
  });

  if (!theme) {
    return (
      <div className="p-4 text-slate-300">
        Unknown theme. Check the URL.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8 text-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        {theme.name}
      </h1>
      <p className="text-sm text-slate-400 mb-2">{theme.description}</p>
      <p className="text-xs text-slate-500 mb-4">
        Tickers: {theme.tickers.join(", ")}
      </p>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-900/50" />
      ) : (
        <MarketTable items={signals} onSelect={() => {}} />
      )}
    </div>
  );
}
