import { create } from "zustand";

const STORAGE_KEY = "frameora:locale";

export const DATE_FORMAT_OPTIONS = [
  { value: "MMM d, yyyy", label: "Aug 15, 2025" },
  { value: "d MMM yyyy", label: "15 Aug 2025" },
  { value: "yyyy-MM-dd", label: "2025-08-15" },
  { value: "MM/dd/yyyy", label: "08/15/2025" },
  { value: "EEEE, MMMM d, yyyy", label: "Friday, August 15, 2025" },
];

export const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function detectTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function loadInitial() {
  const fallback = { dateFormat: "MMM d, yyyy", timezone: detectTimeZone() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      dateFormat: DATE_FORMAT_OPTIONS.some((o) => o.value === parsed.dateFormat)
        ? parsed.dateFormat
        : fallback.dateFormat,
      timezone: parsed.timezone || fallback.timezone,
    };
  } catch {
    return fallback;
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dateFormat: state.dateFormat, timezone: state.timezone }));
  } catch {
    /* storage unavailable — keep in-memory */
  }
}

export const useLocaleStore = create((set, get) => ({
  ...loadInitial(),
  setDateFormat: (dateFormat) => {
    set({ dateFormat });
    persist(get());
  },
  setTimezone: (timezone) => {
    set({ timezone });
    persist(get());
  },
}));

// Sync getter for non-React modules (e.g. formatters).
export function getLocale() {
  return useLocaleStore.getState();
}