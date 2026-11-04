import { clearSession } from "./authSession";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Endpoints where a 401 is an expected, recoverable outcome (bad credentials,
// reset flows) — never trigger a global session purge for these.
const AUTH_EXEMPT = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/logout",
];

// Client-facing gallery routes are public and must not redirect on 401.
const PUBLIC_PREFIXES = ["/a/"];

function sessionInvalidated(url) {
  if (AUTH_EXEMPT.some((p) => url.includes(p))) return false;
  const endpoint = url.replace(API_BASE, "");
  if (PUBLIC_PREFIXES.some((p) => endpoint.startsWith(p))) return false;

  clearSession();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
  return true;
}

export class ApiError extends Error {
  constructor(message, status, code, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${cleanEndpoint}`;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: "include", // Required for HTTP-only cookies
  };

  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Dead session (expired/invalid cookie or stale localStorage user):
    // purge the local session and send the user back to login.
    if (response.status === 401 && sessionInvalidated(url)) {
      throw new ApiError("Your session has expired. Please sign in again.", 401, "SESSION_EXPIRED");
    }

    const message =
      (data && (data.message || data.error)) ||
      (typeof data === "string" && data.length < 200 ? data : `Request failed with status ${response.status}`);
    const code = data?.code;
    throw new ApiError(message, response.status, code, data);
  }

  return data;
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: "DELETE" }),
};

export default api;
