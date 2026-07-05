import { api } from "../api";

/** POST /api/orders/checkout — { delivery_address, notes? } — customer */
export function checkout(payload) {
  return api.post("/api/orders/checkout", payload).then((res) => res.data);
}

/** GET /api/orders — customer's own order history */
export function getMyOrders() {
  return api.get("/api/orders").then((res) => res.data);
}

/** GET /api/orders/{order_id} — customer(owner)/restaurant owner/admin */
export function getOrder(orderId) {
  return api.get(`/api/orders/${orderId}`).then((res) => res.data);
}

/** GET /api/orders/restaurant/{restaurant_id} — restaurant owner/admin */
export function getRestaurantOrders(restaurantId) {
  return api.get(`/api/orders/restaurant/${restaurantId}`).then((res) => res.data);
}

/** PATCH /api/orders/{order_id}/status — { status } — restaurant owner/admin */
export function updateOrderStatus(orderId, status) {
  return api.patch(`/api/orders/${orderId}/status`, { status }).then((res) => res.data);
}
