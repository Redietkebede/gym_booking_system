"use client";

import { useEffect, useState } from "react";

export type ToastTone = "success" | "error";

export type ToastMessage = {
  message: string;
  tone: ToastTone;
};

export function useToast(autoHideMs = 2800) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), autoHideMs);
    return () => window.clearTimeout(timeout);
  }, [toast, autoHideMs]);

  return { toast, setToast };
}
