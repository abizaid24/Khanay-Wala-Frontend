import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { KOTDivider } from "../components/shared/KOTDivider";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-saffron-600 dark:text-saffron-400">
        Order Not Found
      </span>
      <h1 className="text-5xl font-semibold text-ink-900 dark:text-cream-50">404</h1>
      <p className="max-w-sm text-ink-600 dark:text-ink-200">
        Ye page kitchen se nahi nikla — shayad galat address pe order bheja gaya hai.
      </p>
      <KOTDivider className="w-full max-w-xs" />
      <Link to="/">
        <Button size="lg">Back to KhanayWala</Button>
      </Link>
    </div>
  );
}
