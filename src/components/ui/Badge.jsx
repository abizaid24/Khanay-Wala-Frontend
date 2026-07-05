import { cn } from "../../lib/utils";

const TONES = {
  saffron: "bg-saffron-50 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-200",
  paprika: "bg-paprika-500/10 text-paprika-600 dark:bg-paprika-500/20 dark:text-paprika-400",
  cardamom: "bg-cardamom-500/10 text-cardamom-600 dark:bg-cardamom-500/20 dark:text-cardamom-400",
  neutral: "bg-ink-900/6 text-ink-700 dark:bg-cream-100/10 dark:text-cream-200",
};

export function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        TONES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
