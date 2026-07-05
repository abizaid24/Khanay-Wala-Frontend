# KhanayWala Frontend — Phase 2 (Customer Features + Full API Integration)

## What's done

**Restaurant & Food browsing** (public, no login needed)
- `/restaurants` — two tabs: **Restaurants** (`GET /api/restaurants?search=`) and **Dishes**
  (`GET /api/foods/search?q=`), debounced search on both.
- `/restaurants/:id` — restaurant detail (`GET /api/restaurants/{id}`), full menu
  (`GET /api/restaurants/{id}/foods`), and reviews (`GET /api/restaurants/{id}/reviews`) with an
  average rating computed client-side from the review list. "Add to cart" on every available
  item.

**Cart** — `CartContext` wraps the whole app for customers, backed 1:1 by your cart endpoints:
- Loads on login (`GET /api/cart`), mutated via `POST /items`, `PUT /items/{id}`,
  `DELETE /items/{id}`, `DELETE` (clear).
- Navbar shows a live item-count badge.
- If you try to add an item from a second restaurant, the backend's real error — *"Your cart
  has items from another restaurant. Clear your cart first..."* — is shown as-is, not
  reworded, so the message stays accurate to what actually happened.

**Checkout & Orders**
- `/checkout` — order summary, delivery address + notes → `POST /api/orders/checkout`, then
  redirects straight to the new order's detail page.
- `/orders` — order history (`GET /api/orders`).
- `/orders/:id` — full detail (`GET /api/orders/{id}`) with a visual status tracker built from
  the real `OrderStatus` enum (pending → preparing → out for delivery → delivered, with
  cancelled shown separately, matching your backend's actual transition rules).
- When an order is `delivered`, a review form appears (`POST /api/reviews`); duplicate-review
  and wrong-status errors from the backend are surfaced verbatim.

**AI Assistant** — `/assistant`, a chat UI wired to `POST /api/chat` and
`GET /api/chat/history`, loading past turns on open.

**Full API integration** — every domain has its own service file under
`src/lib/services/` (`restaurantService`, `foodService`, `cartService`, `orderService`,
`reviewService`, `chatService`, `categoryService`, `authService`), each function mapped
1:1 to a real endpoint, documented with its route and required role in a comment.

## Honesty notes (things I didn't fake)
- Your `browseRestaurants` and `searchFoods` endpoints don't accept a category filter, so I
  did **not** add fake "filter by category" chips — `categoryService.listCategories()` is
  wired and ready, but there's nothing in the UI pretending to filter by it yet. Real category
  filtering would need a backend change (e.g. `category_id` query param) before Phase 3.
- `CartItemOut` and `OrderItemOut` don't include restaurant name/image, only IDs — so the cart
  and order-history pages intentionally don't show a restaurant name inline; the "View
  restaurant" link on dish search results and order detail goes off `restaurant_id`, which is
  real.
- `/orders/:id` is customer-only for now, even though your backend also allows the owning
  restaurant owner or an admin to view it — that access will make sense once the owner
  dashboard exists in Phase 3, so I didn't build a half-working owner view early.

## Verified
- `npm run build` — clean.
- `npm run lint` — 0 errors (same 2 pre-existing fast-refresh warnings on context files as
  Phase 1, plus one more on the new `CartContext`, all expected/harmless for that pattern).
- Dev server boots; `/`, `/restaurants`, `/login`, `/register` all resolve.

## Not in Phase 2 (Phase 3, per your plan)
Restaurant Owner Dashboard (create/edit restaurant, manage menu, view incoming orders),
Admin Dashboard, Analytics/Charts/Reports, and final production polish/responsive pass.
