"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
};

type Toast = {
  message: string;
  tone: "success" | "error";
};

type ServiceFormState = {
  name: string;
  description: string;
  durationMinutes: string;
  price: string;
  isActive: boolean;
};

const emptyState: ServiceFormState = {
  name: "",
  description: "",
  durationMinutes: "",
  price: "",
  isActive: true,
};

const inputClassName =
  "rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-sm text-(--brand-ink) placeholder:text-(--brand-ink)/40";

function ToastNotice({ toast }: { toast: Toast | null }) {
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

function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return { toast, setToast };
}

function useServiceForm(initial?: Service) {
  const [formState, setFormState] = useState<ServiceFormState>(() => {
    if (!initial) {
      return emptyState;
    }
    return {
      name: initial.name,
      description: initial.description ?? "",
      durationMinutes: String(initial.durationMinutes),
      price: String(initial.price),
      isActive: initial.isActive,
    };
  });

  const payload = useMemo(() => {
    const name = formState.name.trim();
    const description = formState.description.trim();
    const durationMinutes = Number(formState.durationMinutes);
    const price = Number(formState.price);

    return {
      name,
      description: description.length ? description : null,
      durationMinutes,
      price,
      isActive: formState.isActive,
    };
  }, [formState]);

  return { formState, setFormState, payload };
}

export function NewServiceForm() {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const { formState, setFormState, payload } = useServiceForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload.name || !payload.durationMinutes || !payload.price) {
      setToast({ message: "Name, duration, and price are required.", tone: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create service.");
      }

      setToast({ message: "Service created.", tone: "success" });
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({ message: "Unable to create service.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ToastNotice toast={toast} />
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Service name
          </label>
          <input
            className={inputClassName}
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Strength Foundations"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Description
          </label>
          <textarea
            className={`${inputClassName} min-h-[120px] resize-none`}
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Short overview of the service."
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={formState.durationMinutes}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  durationMinutes: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Price (ETB)
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={formState.price}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, price: event.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-(--cta-bg) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--cta-fg) transition hover:-translate-y-px hover:bg-(--cta-hover)"
            disabled={isSaving}
          >
            {isSaving ? "Saving" : "Create service"}
          </button>
          <button
            type="button"
            className="rounded-full border border-(--brand-ink) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export function EditServiceForm({ initialService }: { initialService: Service }) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const { formState, setFormState, payload } = useServiceForm(initialService);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload.name || !payload.durationMinutes || !payload.price) {
      setToast({ message: "Name, duration, and price are required.", tone: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialService.id, ...payload }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service.");
      }

      setToast({ message: "Service updated.", tone: "success" });
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({ message: "Unable to update service.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialService.id,
          isActive: !formState.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      setFormState((prev) => ({ ...prev, isActive: !prev.isActive }));
      setToast({
        message: `Service marked ${!formState.isActive ? "active" : "inactive"}.`,
        tone: "success",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({ message: "Unable to update status.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      "Delete this service? This cannot be undone.",
    );
    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialService.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete service.");
      }

      setToast({ message: "Service deleted.", tone: "success" });
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({ message: "Unable to delete service.", tone: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ToastNotice toast={toast} />
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Service name
          </label>
          <input
            className={inputClassName}
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Description
          </label>
          <textarea
            className={`${inputClassName} min-h-[120px] resize-none`}
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={formState.durationMinutes}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  durationMinutes: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Price (ETB)
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={formState.price}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, price: event.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-(--cta-bg) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--cta-fg) transition hover:-translate-y-px hover:bg-(--cta-hover)"
            disabled={isSaving}
          >
            {isSaving ? "Saving" : "Save changes"}
          </button>
          <button
            type="button"
            className="rounded-full border border-(--border-subtle) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
            onClick={handleToggle}
            disabled={isSaving}
          >
            {formState.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            className="rounded-full border border-(--brand-ember) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ember) transition hover:-translate-y-px"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting" : "Delete"}
          </button>
        </div>
      </form>
    </>
  );
}
