import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { Logo } from "../shared/Logo";
import { ThemeToggle } from "../shared/ThemeToggle";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ROLES } from "../../constants/roles";

const NAV_LINKS = [
  { to: "/restaurants", label: "Restaurants" },
  { to: "/about", label: "Our Story" },
];

export function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const { itemCount } = useCart();
  const isCustomer = isAuthenticated && role === ROLES.CUSTOMER;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="glass-surface sticky top-0 z-50">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-saffron-600 dark:text-cream-200 dark:hover:text-saffron-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isCustomer && (
            <>
              <Link
                to="/assistant"
                className="flex size-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-900/5 dark:text-cream-100 dark:hover:bg-cream-100/10"
                aria-label="AI Assistant"
              >
                <Sparkles className="size-[18px]" />
              </Link>
              <Link
                to="/cart"
                className="relative flex size-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-900/5 dark:text-cream-100 dark:hover:bg-cream-100/10"
                aria-label="View cart"
              >
                <ShoppingBag className="size-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-paprika-500 text-[10px] font-bold text-cream-50">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink-800 hover:bg-ink-900/5 dark:text-cream-100 dark:hover:bg-cream-100/10"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-saffron-500 text-cream-50">
                  <User className="size-3.5" />
                </span>
                {user?.full_name?.split(" ")[0] || "Account"}
              </Link>
              <Button variant="secondary" size="sm" onClick={() => { logout(); navigate("/"); }}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign up
              </Button>
            </div>
          )}
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-full md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-ink-900/5 px-6 py-4 md:hidden dark:border-cream-100/10">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-ink-900/5 dark:hover:bg-cream-100/10" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-ink-900/10 dark:bg-cream-100/10" />
          <div className="flex items-center justify-between px-3">
            <span className="text-sm text-ink-600 dark:text-ink-200">Appearance</span>
            <ThemeToggle />
          </div>
          <div className="mt-2 flex flex-col gap-2 px-3">
            {isCustomer && (
              <>
                <Button variant="secondary" onClick={() => { setOpen(false); navigate("/orders"); }}>
                  Your orders
                </Button>
                <Button variant="secondary" className="gap-2" onClick={() => { setOpen(false); navigate("/cart"); }}>
                  <ShoppingBag className="size-4" /> Cart{itemCount > 0 ? ` (${itemCount})` : ""}
                </Button>
                <Button variant="secondary" className="gap-2" onClick={() => { setOpen(false); navigate("/assistant"); }}>
                  <Sparkles className="size-4" /> AI Assistant
                </Button>
              </>
            )}
            {isAuthenticated ? (
              <>
                <Button variant="secondary" onClick={() => { setOpen(false); navigate("/dashboard"); }}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => { setOpen(false); logout(); navigate("/"); }}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => { setOpen(false); navigate("/login"); }}>
                  Log in
                </Button>
                <Button onClick={() => { setOpen(false); navigate("/register"); }}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
