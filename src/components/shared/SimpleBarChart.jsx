/**
 * A small, dependency-free SVG bar chart. The project has no charting
 * library installed, and this environment can't reach npm to add one — so
 * rather than fake a "chart" with a stock screenshot, this renders real
 * numbers (computed from actual order data) as plain, honest bars.
 */
export function SimpleBarChart({ data, valueFormatter = (v) => v, height = 160 }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-ink-400">
        No data yet for this period.
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => {
        const pct = Math.max(2, Math.round((d.value / max) * 100));
        return (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="font-mono text-[11px] font-semibold text-ink-700 dark:text-cream-200">
              {d.value > 0 ? valueFormatter(d.value) : ""}
            </span>
            <div
              className="w-full rounded-t-lg bg-saffron-400 transition-all dark:bg-saffron-500/70"
              style={{ height: `${pct}%`, minHeight: 4 }}
              title={`${d.label}: ${valueFormatter(d.value)}`}
            />
            <span className="text-[10px] font-medium text-ink-400">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
