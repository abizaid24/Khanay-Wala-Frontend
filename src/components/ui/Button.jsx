import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const VARIANTS = {
  primary:
    "bg-saffron-500 text-cream-50 hover:bg-saffron-600 shadow-soft shadow-saffron-600/20",
  secondary:
    "bg-transparent text-ink-900 dark:text-cream-100 border border-ink-900/15 dark:border-cream-100/15 hover:bg-ink-900/5 dark:hover:bg-cream-100/5",
  paprika: "bg-paprika-500 text-cream-50 hover:bg-paprika-600 shadow-soft",
  ghost: "bg-transparent text-ink-700 dark:text-cream-200 hover:bg-ink-900/5 dark:hover:bg-cream-100/10",
  link: "bg-transparent text-saffron-600 dark:text-saffron-400 hover:underline px-0",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
