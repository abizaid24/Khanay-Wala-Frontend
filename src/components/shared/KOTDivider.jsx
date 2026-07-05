import { cn } from "../../lib/utils";

/**
 * A perforated-ticket rule — the recurring signature motif that ties every
 * section back to the ordering ritual (a KOT is the paper slip a dhaba
 * kitchen tears off to start cooking your order).
 */
export function KOTDivider({ className, label }) {
  return (
    <div className={cn("flex items-center gap-4 px-6", className)}>
      <div className="kot-divider flex-1" />
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
          {label}
        </span>
      )}
      <div className="kot-divider flex-1" />
    </div>
  );
}
