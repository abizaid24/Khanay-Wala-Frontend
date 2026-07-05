import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists safely, later classes win on conflicts. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format a numeric/decimal-string price the way a Pakistani customer expects. */
export function formatPKR(amount) {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Small helper to turn "restaurant_owner" into "Restaurant Owner". */
export function titleCaseFromSnake(value) {
  return String(value ?? "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
