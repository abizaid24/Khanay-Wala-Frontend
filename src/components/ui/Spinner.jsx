import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Spinner({ className, label = "Loading" }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-ink-400", className)} role="status">
      <Loader2 className="size-5 animate-spin text-saffron-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 dark:bg-ink-900">
      <Spinner label="Getting things ready" />
    </div>
  );
}
