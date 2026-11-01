import { api } from "../lib/api";

function err(code, message, retryAfter) {
  const e = new Error(message);
  e.code = code;
  if (retryAfter) e.retryAfter = retryAfter;
  return e;
}

export async function resolveAlbumByToken(token) {
  try {
    return await api.get(`/a/${token}`);
  } catch (error) {
    throw err(error.code || "INVALID_LINK", error.message || "This link doesn't look right.");
  }
}

export async function verifyAlbumAccess(token, password) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw err("NETWORK", "We couldn't verify your password. Check your connection and try again.");
  }

  try {
    return await api.post(`/a/${token}/verify`, { password });
  } catch (error) {
    throw err(
      error.code || "INCORRECT_PASSWORD",
      error.message || "The password is incorrect. Please try again.",
      error.data?.retryAfter
    );
  }
}