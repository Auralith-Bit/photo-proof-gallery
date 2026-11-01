const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

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
