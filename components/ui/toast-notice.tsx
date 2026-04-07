"use client";

import type { ToastMessage } from "@/hooks/use-toast";

type ToastNoticeProps = {
  toast: ToastMessage | null;
};

export default function ToastNotice({ toast }: ToastNoticeProps) {
  if (!toast) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-4 py-3 text-sm shadow-[0_16px_40px_var(--shadow-color)] ${
        toast.tone === "success"
          ? "border-(--border-subtle) bg-(--surface-solid) text-(--brand-ink)"
          : "border-(--brand-ember) bg-(--surface-solid) text-(--brand-ink)"
      }`}
      role="status"
    >
      {toast.message}
    </div>
  );
}
