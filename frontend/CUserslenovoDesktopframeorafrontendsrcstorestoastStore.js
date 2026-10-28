import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, type: "info", duration: 4000, ...toast };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    if (newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, newToast.duration);
    }
    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message, options) => useToastStore.getState().addToast({ type: "success", message, ...options }),
  error: (message, options) => useToastStore.getState().addToast({ type: "error", message, ...options }),
  warning: (message, options) => useToastStore.getState().addToast({ type: "warning", message, ...options }),
  info: (message, options) => useToastStore.getState().addToast({ type: "info", message, ...options }),
};
