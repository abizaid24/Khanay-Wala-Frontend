import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Bike,
  ShieldCheck,
  Wallet,
  Sparkles,
  Flame,
  Soup,
  Sandwich,
  IceCreamCone,
  Beef,
  CupSoda,
  Store,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SectionHeading } from "../components/shared/SectionHeading";
import { KOTDivider } from "../components/shared/KOTDivider";

const CATEGORIES = [
  { label: "Karahi", icon: Flame },
  { label: "BBQ & Tikka", icon: Beef },
  { label: "Biryani & Rice", icon: Soup },
  { label: "Fast Food", icon: Sandwich },
  { label: "Mithai & Desserts", icon: IceCreamCone },
  { label: "Beverages", icon: CupSoda },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified restaurants only",
    body: "Every kitchen on KhanayWala is approved by our team before it ever reaches your feed.",
  },
  {
    icon: Bike,
    title: "Live order tracking",
    body: "Follow your order from the kitchen to your gali — pending, preparing, out for delivery.",
  },
  {
    icon: Wallet,
    title: "Cash or card, your call",
    body: "Pay however suits you. No hidden charges, no surprise fees at checkout.",
  },
  {
    icon: Sparkles,
    title: "An AI that gets desi cravings",
    body: "Not sure what to eat? Ask KhanayWala's assistant and get suggestions that actually fit your mood.",
  },
];

const STEPS = [
  { title: "Bataiye kya khana hai", body: "Browse restaurants near you or let our AI suggest something." },
  { title: "Cart mein daaliye", body: "Build your order from one restaurant at a time, just like a real kitchen ticket." },
  { title: "Order chit kitchen tak", body: "Your order prints straight to the kitchen and cooking starts immediately." },
  { title: "Darwaze tak delivery", body: "Track every status change live, right until it's at your door." },
];

export default function LandingPage() {
  return (
    <div>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-24 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 0%, var(--color-saffron-200) 0%, transparent 70%)",
            opacity: 0.55,
          }}
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-50 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
              <Flame className="size-3.5" /> Made for Pakistan
            </span>
            <h1 className="text-4xl font-semibold leading-[1.08] text-ink-900 sm:text-6xl dark:text-cream-50">
              Khaana, jo waqai
              <br />
              <span className="text-saffron-500">khushi se</span> banaya jaaye.
            </h1>
            <p className="max-w-md text-lg text-ink-600 dark:text-ink-200">
              KhanayWala connects you to the best local kitchens — from dhaba karahi to
              fine-dining biryani — with honest tracking and zero drama.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2 rounded-3xl bg-cream-50 p-2 shadow-lifted sm:flex-row dark:bg-ink-800"
            >
              <div className="flex flex-1 items-center gap-2 rounded-2xl px-4 py-2.5">
                <MapPin className="size-4 shrink-0 text-saffron-500" />
                <input
                  type="text"
                  placeholder="Delivery address — e.g. DHA Phase 5, Lahore"
                  className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none dark:text-cream-50"
                />
              </div>
              <Button type="submit" size="lg" className="gap-2">
                <Search className="size-4" /> Find food
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORIES.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-ink-900/8 bg-cream-50/60 px-3.5 py-1.5 text-sm text-ink-700 dark:border-cream-100/10 dark:bg-ink-800/60 dark:text-cream-200"
                >
                  <Icon className="size-3.5 text-saffron-500" /> {label}
                </span>
              ))}
            </div>
          </div>

          {/* Decorative order-chit — the signature ticket motif, shown as real product content */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="ticket-notch rounded-3xl bg-cream-50 p-6 shadow-lifted dark:bg-ink-800">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-ink-400">
                <span>Order Chit</span>
                <span>#KW-1042</span>
              </div>
              <div className="kot-divider my-4" />
              <ul className="flex flex-col gap-3 font-mono text-sm text-ink-800 dark:text-cream-100">
                <li className="flex justify-between"><span>1× Chicken Karahi</span><span>Rs. 950</span></li>
                <li className="flex justify-between"><span>2× Roghni Naan</span><span>Rs. 120</span></li>
                <li className="flex justify-between"><span>1× Kashmiri Chai</span><span>Rs. 150</span></li>
              </ul>
              <div className="kot-divider my-4" />
              <div className="flex justify-between font-mono text-sm font-semibold text-ink-900 dark:text-cream-50">
                <span>Total</span><span>Rs. 1,220</span>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-cardamom-500/10 px-3 py-2 text-xs font-semibold text-cardamom-600 dark:text-cardamom-400">
                <Bike className="size-3.5" /> Out for delivery · 18 min away
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -right-6 -top-6 -z-10 size-40 rounded-full bg-paprika-400/20 blur-2xl"
            />
          </div>
        </div>
      </section>

      <KOTDivider label="Kaisay chalta hai" className="mb-20" />

      {/* --------------------------------------------------------- Steps */}
      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Process"
          title="Order karna itna simple hona chahiye"
          description="Four steps, no confusion — from craving to doorstep."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Card key={step.title} className="p-6">
              <span className="font-mono text-sm text-saffron-500">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink-900 dark:text-cream-50">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <KOTDivider className="my-20" />

      {/* ------------------------------------------------------ Features */}
      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Why KhanayWala"
          title="Baaqi apps se mukhtalif, waja se"
          description="Built as its own product for Pakistan's kitchens and customers — not a copy of anything else."
          className="mx-auto"
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="flex gap-4 p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15 dark:text-saffron-300">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-ink-900 dark:text-cream-50">{title}</h3>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Owner CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 px-8 py-14 text-cream-50 sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-saffron-500/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-saffron-500/20 text-saffron-300">
              <Store className="size-6" />
            </span>
            <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">
              Apna restaurant KhanayWala pe list karain.
            </h2>
            <p className="max-w-md text-ink-200">
              No commission games, no hidden fees — just your menu, your orders, and your own
              sales dashboard.
            </p>
            <Link to="/register">
              <Button size="lg" className="mt-2">Partner with us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
