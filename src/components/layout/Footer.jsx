import { Link } from "react-router-dom";
import { Logo } from "../shared/Logo";
import { KOTDivider } from "../shared/KOTDivider";

const COLUMNS = [
  {
    title: "KhanayWala",
    links: [
      { to: "/about", label: "Our Story" },
      { to: "/restaurants", label: "Browse Restaurants" },
    ],
  },
  {
    title: "Partner",
    links: [
      { to: "/register", label: "Register a Restaurant" },
      { to: "/login", label: "Owner Login" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/help", label: "Help Centre" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 pt-16 text-cream-200">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Logo size="lg" />
            <p className="max-w-xs text-sm text-ink-200">
              Ghar jaisa khana, shehr bhar se — order karo apne mehboob restaurants se, chand
              minutes mein.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-cream-50">{col.title}</h4>
              {col.links.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-ink-200 hover:text-saffron-400">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <KOTDivider className="opacity-40" />
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-400 sm:flex-row">
          <span>© {new Date().getFullYear()} KhanayWala. Made with josh in Pakistan.</span>
          <span>PKR • Urdu / English</span>
        </div>
      </div>
    </footer>
  );
}
