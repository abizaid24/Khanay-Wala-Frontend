import { api } from "../api";

/** POST /api/auth/register — body: { full_name, email, phone?, password, role } */
export function registerUser(payload) {
  return api.post("/api/auth/register", payload).then((res) => res.data);
}

/**
 * POST /api/auth/login — backend uses OAuth2PasswordRequestForm, so this
 * MUST be sent as application/x-www-form-urlencoded with a "username" field
 * (which the backend treats as the email), not JSON.
 */
export function loginUser({ email, password }) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  return api
    .post("/api/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((res) => res.data);
}

/** GET /api/auth/profile — requires bearer token */
export function fetchProfile() {
  return api.get("/api/auth/profile").then((res) => res.data);
}
