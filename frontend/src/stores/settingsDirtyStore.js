import { create } from "zustand";

// Tracks whether the active settings section has unsaved changes so the
// section navigation can warn before discarding them.
export const useSettingsDirtyStore = create((set) => ({
  dirty: false,
  setDirty: (dirty) => set({ dirty }),
}));