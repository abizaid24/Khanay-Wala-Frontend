import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

export const Textarea = forwardRef(
  ({ className, label, error, hint, id, rows = 3, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700 dark:text-cream-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            "w-full resize-none rounded-2xl border border-ink-900/10 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400",
            "outline-none transition-colors focus:border-saffron-500",
            "dark:border-cream-100/10 dark:bg-ink-700 dark:text-cream-50 dark:placeholder:text-ink-200",
            error && "border-paprika-500 focus:border-paprika-500",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs font-medium text-paprika-500">{error}</p>}
        {!error && hint && <p className="text-xs text-ink-400">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
