import { api } from "../api";

/** GET /api/restaurants/{restaurant_id}/foods — public menu */
export function getMenu(restaurantId) {
  return api.get(`/api/restaurants/${restaurantId}/foods`).then((res) => res.data);
}

/** GET /api/foods/search?q= — public, across all restaurants */
export function searchFoods({ q, skip = 0, limit = 20 }) {
  return api.get("/api/foods/search", { params: { q, skip, limit } }).then((res) => res.data);
}

/** POST /api/restaurants/{restaurant_id}/foods — owner/admin */
export function createFoodItem(restaurantId, payload) {
  return api.post(`/api/restaurants/${restaurantId}/foods`, payload).then((res) => res.data);
}

/** PUT /api/foods/{food_id} — owner/admin */
export function updateFoodItem(foodId, payload) {
  return api.put(`/api/foods/${foodId}`, payload).then((res) => res.data);
}

/** DELETE /api/foods/{food_id} — owner/admin */
export function deleteFoodItem(foodId) {
  return api.delete(`/api/foods/${foodId}`);
}
