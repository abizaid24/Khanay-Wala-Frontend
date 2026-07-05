import { Link } from "react-router-dom";
import { Receipt, ShieldCheck, ShoppingBag, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { titleCaseFromSnake } from "../lib/utils";
import { ROLES } from "../constants/roles";

const CUSTOMER_SHORTCUTS = [
  { to: "/restaurants", icon: Store, title: "Browse restaurants", body: "Find your next order." },
  { to: "/cart", icon: ShoppingBag, title: "Your cart", body: "Pick up where you left off." },
  { to: "/orders", icon: Receipt, title: "Order history", body: "Track status and leave reviews." },
  { to: "/assistant", icon: Sparkles, title: "AI Assistant", body: "Not sure what to eat? Ask." },
];

const OWNER_SHORTCUTS = [
  { to: "/owner", icon: Store, title: "Your restaurants", body: "Manage listings, menus, and orders." },
  { to: "/owner/restaurants/new", icon: UtensilsCrossed, title: "Add a restaurant", body: "List a new place on KhanayWala." },
];

const ADMIN_SHORTCUTS = [
  { to: "/admin", icon: ShieldCheck, title: "Restaurant approvals", body: "Review restaurants waiting to go live." },
];

const SHORTCUTS_BY_ROLE = {
  [ROLES.CUSTOMER]: CUSTOMER_SHORTCUTS,
  [ROLES.RESTAURANT_OWNER]: OWNER_SHORTCUTS,
  [ROLES.ADMIN]: ADMIN_SHORTCUTS,
};

const SUBTITLE_BY_ROLE = {
  [ROLES.CUSTOMER]: "Everything you need to order, track, and repeat is right here.",
  [ROLES.RESTAURANT_OWNER]: "Manage your restaurants, menus, and incoming orders from here.",
  [ROLES.ADMIN]: "Keep an eye on restaurants waiting for approval.",
};

export default function Dashboard() {
  const { user } = useAuth();
  const shortcuts = SHORTCUTS_BY_ROLE[user?.role] || [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Card className="p-8">
        <Badge tone="saffron">{titleCaseFromSnake(user?.role)}</Badge>
        <h1 className="mt-4 text-2xl font-semibold text-ink-900 dark:text-cream-50">
          Assalam-o-Alaikum, {user?.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-2 text-ink-600 dark:text-ink-200">
          {SUBTITLE_BY_ROLE[user?.role] || "You're logged in and talking to the real KhanayWala API."}
        </p>
      </Card>

      {shortcuts.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {shortcuts.map(({ to, icon: Icon, title, body }) => (
            <Link key={to} to={to}>
              <Card className="flex h-full items-start gap-4 p-5 transition-colors hover:border-saffron-300">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15 dark:text-saffron-300">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink-900 dark:text-cream-50">{title}</h3>
                  <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{body}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
