import { cn } from "../../lib/utils";

export function EmptyState({ icon: Icon, title, body, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-3xl border border-dashed border-ink-900/10 px-6 py-16 text-center dark:border-cream-100/10", className)}>
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-500 dark:bg-saffron-500/10">
          <Icon className="size-6" />
        </span>
      )}
      <h3 className="text-lg font-semibold text-ink-900 dark:text-cream-50">{title}</h3>
      {body && <p className="max-w-sm text-sm text-ink-600 dark:text-ink-200">{body}</p>}
      {action}
    </div>
  );
}
