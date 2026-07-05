import { Link, Outlet } from "react-router-dom";
import { Logo } from "../shared/Logo";
import { ThemeToggle } from "../shared/ThemeToggle";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100 dark:bg-ink-900">
      <header className="flex items-center justify-between px-6 py-5">
        <Link to="/">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
