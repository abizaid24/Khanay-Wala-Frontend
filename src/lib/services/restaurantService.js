import { api } from "../api";

/** GET /api/restaurants?search=&skip=&limit= — public, approved+active only */
export function browseRestaurants({ search, skip = 0, limit = 20 } = {}) {
  return api
    .get("/api/restaurants", { params: { search: search || undefined, skip, limit } })
    .then((res) => res.data);
}

/** GET /api/restaurants/{id} — public */
export function getRestaurant(restaurantId) {
  return api.get(`/api/restaurants/${restaurantId}`).then((res) => res.data);
}

/** GET /api/restaurants/mine — restaurant_owner */
export function getMyRestaurants() {
  return api.get("/api/restaurants/mine").then((res) => res.data);
}

/** POST /api/restaurants — restaurant_owner */
export function createRestaurant(payload) {
  return api.post("/api/restaurants", payload).then((res) => res.data);
}

/** PUT /api/restaurants/{id} — owner/admin */
export function updateRestaurant(restaurantId, payload) {
  return api.put(`/api/restaurants/${restaurantId}`, payload).then((res) => res.data);
}

/** GET /api/restaurants/pending — admin */
export function getPendingRestaurants() {
  return api.get("/api/restaurants/pending").then((res) => res.data);
}

/** PATCH /api/restaurants/{id}/approve — admin */
export function approveRestaurant(restaurantId) {
  return api.patch(`/api/restaurants/${restaurantId}/approve`).then((res) => res.data);
}
