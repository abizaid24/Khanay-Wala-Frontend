import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export function RatingStars({ value = 0, onChange, size = "sm", className }) {
  const interactive = typeof onChange === "function";
  const dims = size === "lg" ? "size-6" : size === "md" ? "size-4" : "size-3.5";

  return (
    <div className={cn("flex items-center gap-0.5", className)} role={interactive ? "radiogroup" : "img"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(!interactive && "cursor-default")}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              dims,
              n <= Math.round(value) ? "fill-saffron-500 text-saffron-500" : "fill-transparent text-ink-200 dark:text-ink-600"
            )}
          />
        </button>
      ))}
    </div>
  );
}
