import { api } from "../api";

/** POST /api/reviews — { order_id, rating, comment? } — customer, verified purchase only */
export function createReview(payload) {
  return api.post("/api/reviews", payload).then((res) => res.data);
}

/** GET /api/restaurants/{restaurant_id}/reviews — public */
export function getRestaurantReviews(restaurantId) {
  return api.get(`/api/restaurants/${restaurantId}/reviews`).then((res) => res.data);
}

/** DELETE /api/reviews/{review_id} — review owner/admin */
export function deleteReview(reviewId) {
  return api.delete(`/api/reviews/${reviewId}`);
}
