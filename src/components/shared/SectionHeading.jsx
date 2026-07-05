import { cn } from "../../lib/utils";

export function SectionHeading({ eyebrow, title, description, align = "left", className }) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-saffron-600 dark:text-saffron-400">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-xl text-3xl font-semibold leading-tight text-ink-900 dark:text-cream-50 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-lg text-base text-ink-600 dark:text-ink-200">{description}</p>
      )}
    </div>
  );
}
