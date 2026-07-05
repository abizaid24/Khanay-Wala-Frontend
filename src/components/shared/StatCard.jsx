import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

/** A single at-a-glance metric — used on owner/admin dashboards. */
export function StatCard({ icon: Icon, label, value, tone = "saffron", className }) {
  const tones = {
    saffron: "bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15 dark:text-saffron-300",
    cardamom: "bg-cardamom-500/10 text-cardamom-600 dark:bg-cardamom-500/20 dark:text-cardamom-400",
    paprika: "bg-paprika-500/10 text-paprika-600 dark:bg-paprika-500/20 dark:text-paprika-400",
    neutral: "bg-ink-900/6 text-ink-700 dark:bg-cream-100/10 dark:text-cream-200",
  };

  return (
    <Card className={cn("flex items-center gap-4 p-5", className)}>
      {Icon && (
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="mt-0.5 truncate font-mono text-xl font-semibold text-ink-900 dark:text-cream-50">{value}</p>
      </div>
    </Card>
  );
}
