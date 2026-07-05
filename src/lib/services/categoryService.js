import { api } from "../api";

/** GET /api/categories — public */
export function listCategories() {
  return api.get("/api/categories").then((res) => res.data);
}
