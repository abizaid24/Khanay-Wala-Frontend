# KhanayWala Frontend — Phase 1 (Foundation)

React (JSX) + Vite + Tailwind v4, wired to your existing FastAPI backend. No fake
endpoints — everything here talks to (or is structured around) the real routes in
`food-delivery-backend/app/api/*`.

## Run it

```bash
cd frontend
cp .env.example .env      # set VITE_API_URL to your backend URL
npm install
npm run dev
```

Backend must be running (`uvicorn app.main:app --reload`) with CORS `FRONTEND_URL` allowing
`http://localhost:5173`, which your `.env` already defaults to.

## What's done in Phase 1

**Design system** (`src/index.css`)
- Warm, premium desi palette: saffron/amber primary, paprika red accent, cardamom green,
  golden-cream base — built for Tailwind v4's `@theme`.
- Fonts: Fraunces (display), Manrope (body/UI), IBM Plex Mono (prices, order codes).
- Signature motif: a "kitchen order ticket" (KOT) perforation — `.kot-divider` and
  `.ticket-notch` — used as the recurring structural device between sections instead of
  generic dividers.
- Full light/dark mode via a `.dark` class on `<html>`, toggled and persisted from
  `ThemeContext`.

**Project structure**
```
src/
  components/ui/       Button, Card, Input, Badge, Spinner — the base design system
  components/shared/    Logo, ThemeToggle, KOTDivider, SectionHeading
  components/layout/    Navbar, Footer, MainLayout, AuthLayout
  context/              AuthContext (session), ThemeContext (light/dark)
  lib/                   api.js (axios + auto token refresh), authService.js, storage.js, utils.js
  routes/                AppRoutes.jsx (route table), ProtectedRoute.jsx (role guard)
  pages/                 LandingPage, auth/Login, auth/Register, Dashboard (placeholder), NotFound
  constants/             roles.js and config.js — mirrors backend enums 1:1
```

**Authentication — fully wired to your real backend**
- Register → `POST /api/auth/register` (JSON body, role limited to
  `customer` / `restaurant_owner`, matching your `RegisterableRole` schema — admin is never
  self-selectable, same rule as the backend).
- Login → `POST /api/auth/login` sent as `application/x-www-form-urlencoded` with a
  `username` field, because your endpoint uses `OAuth2PasswordRequestForm`.
- Access + refresh tokens stored in `localStorage`; an axios response interceptor
  auto-refreshes once on a 401 via `POST /api/auth/refresh?refresh_token=...` and replays
  the original request. If refresh fails, the session is dropped and the user is treated
  as a guest.
- `GET /api/auth/profile` hydrates the current user on load, so a refreshed page keeps you
  logged in.
- `ProtectedRoute` supports optional `roles={[...]}` for role-gated pages later
  (restaurant owner dashboard, admin panel in Phase 3).

**Pages built**
- Landing page: hero with address search + category chips, a decorative "order chit" card
  built from real product content (not a stock photo), a 4-step how-it-works section, a
  feature grid, and a restaurant-owner CTA.
- Login / Register — real forms, real error messages pulled from your API's `detail` field.
- Dashboard — placeholder shell after login (confirms the whole auth loop works
  end-to-end); real customer/owner/admin dashboards are Phase 2 and Phase 3 work.
- 404 page.

**Verified**
- `npm run build` — clean production build, no errors.
- `npm run lint` — 0 errors (2 harmless fast-refresh warnings on the two context files,
  which is expected/standard for that pattern).
- Dev server boots and serves the landing page.

## Not in Phase 1 (by design, per your plan)
Restaurant browsing, food pages, cart, checkout, order tracking, AI chat, reviews, and the
owner/admin dashboards are all Phase 2 and Phase 3 — this phase only builds the foundation
they'll sit on.

## Assumptions made
- JavaScript (JSX), not TypeScript — kept the codebase lean for a 3-phase build. Say the
  word if you'd rather I convert to TypeScript before Phase 2.
- No UI kit (shadcn) installed — I hand-built the primitives in `components/ui` instead, so
  the look stays bespoke per your "no clone, premium/unique" brief rather than inheriting a
  generic kit's defaults.
