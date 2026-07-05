# KhanayWala Frontend — Phase 3 (Owner Dashboard, Admin Dashboard, Analytics)

## Context for this phase
I don't have the backend source in this environment — only the Phase 2 frontend zip. So
everything below is built strictly against the endpoints already reflected in
`src/lib/services/*` from Phases 1–2 (which *were* written against your real backend). I
didn't invent any new endpoints; where a feature would need one that isn't there, I said so
instead of faking it (see "Honesty notes").

## What's done

**Restaurant Owner Dashboard** (`restaurant_owner` role only, gated by `ProtectedRoute`)
- `/owner` — overview of all restaurants you own (`GET /api/restaurants/mine`), each with an
  "Approved / Pending approval" badge and an "Active / Inactive" badge.
- `/owner/restaurants/new` — create a restaurant (`POST /api/restaurants`).
- `/owner/restaurants/:id/edit` — edit name/address/phone/description
  (`PUT /api/restaurants/{id}`), plus a one-click "mark active / temporarily closed" toggle.
- `/owner/restaurants/:id` — a workspace for one restaurant, with three tabs:
  - **Menu** — list, add, edit, delete dishes (`GET/POST` `/api/restaurants/{id}/foods`,
    `PUT/DELETE /api/foods/{food_id}`). Fields match what Phase 1/2 already render on the
    public menu: name, description, price, availability.
  - **Orders** — incoming orders for this restaurant (`GET /api/orders/restaurant/{id}`),
    with buttons to advance status along the real `OrderStatus` sequence (pending →
    preparing → out for delivery → delivered) or cancel a pending order
    (`PATCH /api/orders/{id}/status`).
  - **Analytics** — total orders, delivered count, cancelled count, and revenue from
    delivered orders, plus a 7-day order-volume chart and an orders-by-status chart. All of
    it is computed client-side from the same real order data the Orders tab shows — nothing
    is a separate "analytics" endpoint, because there isn't one.

**Admin Dashboard** (`admin` role only)
- `/admin` — the restaurant approval queue: `GET /api/restaurants/pending` +
  `PATCH /api/restaurants/{id}/approve`. That's the only admin-specific endpoint that
  existed in the services layer coming into this phase, so that's what the dashboard does.

**Dashboard hub** — `/dashboard` now shows role-appropriate shortcuts (owner → "Your
restaurants" / "Add a restaurant"; admin → "Restaurant approvals") instead of the Phase-3
placeholder message from before.

**Charts** — the project has no charting library installed (`package.json` only has axios,
clsx, lucide-react, react-router, tailwind-merge), and this environment couldn't reach npm
to add one. Rather than fake a chart or silently add a new dependency you'd have to review,
`SimpleBarChart` is a small dependency-free SVG/CSS bar chart built to match the existing
design system. It only ever renders numbers computed from real order data.

## Honesty notes (things I didn't build)
- **No platform-wide user management or global analytics for admins.** Your backend (as
  reflected in the services this frontend already talks to) only exposes restaurant
  approval to admins. A "manage all users" or "platform revenue" screen would need
  corresponding endpoints first — I didn't fabricate a UI in front of data that isn't there.
- **No category picker on the food item form.** `categoryService.listCategories()` is wired
  (since Phase 2) but I couldn't confirm `category_id` is actually part of the food item
  schema your backend accepts, so I left it out rather than guess and risk a broken form.
- **I could not run `npm install` / `npm run build` / `npm run lint` in this session** — this
  sandbox has no network access, so npm couldn't reach its registry. Every file was written
  and manually reviewed for consistency with the existing patterns (services, `ProtectedRoute`,
  `Card`/`Button`/`Badge` primitives, error handling via `apiErrorMessage`), but please run
  the usual verification once you have it locally:
  ```bash
  npm install
  npm run build
  npm run lint
  npm run dev
  ```

## Not in this build
Platform-wide admin analytics/reports, in-app notifications, and a final responsive/polish
pass across all three phases — flag any of these if you want them as a Phase 4.
