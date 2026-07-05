import { api } from "../api";

/** POST /api/chat — { message } — customer, returns { reply } */
export function sendChatMessage(message) {
  return api.post("/api/chat", { message }).then((res) => res.data);
}

/** GET /api/chat/history — customer's past turns */
export function getChatHistory() {
  return api.get("/api/chat/history").then((res) => res.data);
}
