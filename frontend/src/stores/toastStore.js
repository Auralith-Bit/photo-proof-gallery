import { create } from "zustand";

let nextId = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  push: (toast) => {
    const id = ++nextId;
    set((state) => ({
      toasts: [...state.toasts, { id, type: "info", ...toast }],
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message, title) =>
    useToastStore.getState().push({ type: "success", message, title }),
  error: (message, title) =>
    useToastStore.getState().push({ type: "error", message, title }),
  warning: (message, title) =>
    useToastStore.getState().push({ type: "warning", message, title }),
  info: (message, title) =>
    useToastStore.getState().push({ type: "info", message, title }),
};