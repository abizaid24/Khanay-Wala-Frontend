import { api } from "../api";

/** GET /api/cart — customer, auto-creates an empty cart */
export function getCart() {
  return api.get("/api/cart").then((res) => res.data);
}

/** POST /api/cart/items — { food_item_id, quantity } */
export function addCartItem(payload) {
  return api.post("/api/cart/items", payload).then((res) => res.data);
}

/** PUT /api/cart/items/{item_id} — { quantity } */
export function updateCartItem(itemId, quantity) {
  return api.put(`/api/cart/items/${itemId}`, { quantity }).then((res) => res.data);
}

/** DELETE /api/cart/items/{item_id} */
export function removeCartItem(itemId) {
  return api.delete(`/api/cart/items/${itemId}`).then((res) => res.data);
}

/** DELETE /api/cart — empties the whole cart, 204 No Content */
export function clearCart() {
  return api.delete("/api/cart");
}
