import { useEffect, useState } from "react";

// Derives a SaveBar status from a mutation + dirty flag, with a brief "saved" flash.
export function useSaveStatus(mutation, dirty) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mutation.isSuccess) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isPending) setSaved(false);
  }, [mutation.isPending]);

  const status = mutation.isPending
    ? "saving"
    : saved
      ? "saved"
      : mutation.isError
        ? "error"
        : dirty
          ? "unsaved"
          : "idle";

  return status;
}