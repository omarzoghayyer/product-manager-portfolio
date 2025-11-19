import { useQuery } from "@tanstack/react-query";
import { imiRepo } from "../api/imiRepo";

export function Clusters() {
  const { data: clusters = [] } = useQuery({
    queryKey: ["clusters"],
    queryFn: () => imiRepo.listClusters(),
  });

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8 text-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Clusters</h1>
      <p className="text-sm text-slate-400 mb-4">
        Event bundles: group related signals (e.g., an earnings day) into a single story.
      </p>
      {clusters.length === 0 ? (
        <div className="text-xs text-slate-500">
          No clusters yet. You’ll seed these manually for now.
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          {clusters.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            >
              <div className="text-slate-100 font-semibold">{c.name}</div>
              <div className="text-slate-400">
                {c.description || "No description."}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {c.signal_ids?.length || 0} signals
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
