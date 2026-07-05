import { cn } from "../../lib/utils";

export function Logo({ className, size = "md" }) {
  const sizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  return (
    <span className={cn("inline-flex items-baseline gap-0.5 font-display font-semibold", sizes[size], className)}>
      <span className="text-ink-900 dark:text-cream-50">Khanay</span>
      <span className="text-saffron-500">Wala</span>
    </span>
  );
}
