// src/components/FiltersBar.jsx
export default function FiltersBar({ values, onChange, stats, options }) {
  const { search = "", minConf = 0, direction = "all" } = values || {};
  const shown = stats?.shown ?? 0;
  const total = stats?.total ?? 0;

  const handleSearchChange = (e) => {
    const v = e.target.value;
    onChange((prev) => ({ ...prev, search: v }));
  };

  const handleDirectionChange = (e) => {
    const v = e.target.value;
    onChange((prev) => ({ ...prev, direction: v }));
  };

  const handleMinConfChange = (e) => {
    const v = Number(e.target.value);
    onChange((prev) => ({ ...prev, minConf: v }));
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Search box */}
      <div className="flex-1">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search headlines or tickers..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm
                     text-slate-200 placeholder:text-slate-500 outline-none
                     focus:ring-2 focus:ring-emerald-500/40"
        />
        {total > 0 && (
          <div className="mt-1 text-[11px] text-slate-500">
            Showing <span className="text-slate-300">{shown}</span> of{" "}
            <span className="text-slate-300">{total}</span> signals
          </div>
        )}
      </div>

      {/* Direction + min confidence */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <select
          value={direction}
          onChange={handleDirectionChange}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm
                     text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500/40"
        >
          <option value="all">All directions</option>
          <option value="up">Up only</option>
          <option value="down">Down only</option>
          <option value="flat">Flat</option>
        </select>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Min confidence</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minConf}
              onChange={handleMinConfChange}
              className="h-1 w-32 cursor-pointer"
            />
            <span className="w-8 text-right tabular-nums text-slate-200">
              {minConf}
            </span>
            <span>%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
