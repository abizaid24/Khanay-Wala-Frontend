import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-ink-900/[0.06] bg-cream-50 shadow-soft",
        "dark:border-cream-100/[0.08] dark:bg-ink-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
