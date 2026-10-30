import { createContext, useContext } from "react";

// Lets any settings page request navigation that is guarded by the
// unsaved-changes check owned by SettingsLayout.
export const SettingsNavContext = createContext(null);

export function useSettingsNav() {
  const ctx = useContext(SettingsNavContext);
  if (!ctx) throw new Error("useSettingsNav must be used within SettingsLayout");
  return ctx;
}