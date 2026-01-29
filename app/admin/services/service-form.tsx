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
  workoutIncludes: string[];
  testimonials: unknown;
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
  workoutIncludes: string;
  testimonials: Array<{
    name: string;
    rating: number;
    quote: string;
  }>;
};

const emptyState: ServiceFormState = {
  name: "",
  description: "",
  durationMinutes: "",
  price: "",
  isActive: true,
  workoutIncludes: "",
  testimonials: [
    {
      name: "",
      rating: 5,
      quote: "",
    },
  ],
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
    const testimonials = (Array.isArray(initial.testimonials)
      ? initial.testimonials
      : [])
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => ({
        name: typeof entry.name === "string" ? entry.name : "",
        rating:
          typeof entry.rating === "number" && Number.isFinite(entry.rating)
            ? Math.min(Math.max(Math.round(entry.rating), 1), 5)
            : 5,
        quote: typeof entry.quote === "string" ? entry.quote : "",
      }));
    const trimmedTestimonials = testimonials.slice(0, 5);
    const seededTestimonials = trimmedTestimonials.length
      ? trimmedTestimonials
      : [
          {
            name: "",
            rating: 5,
            quote: "",
          },
        ];

    return {
      name: initial.name,
      description: initial.description ?? "",
      durationMinutes: String(initial.durationMinutes),
      price: String(initial.price),
      isActive: initial.isActive,
      workoutIncludes: initial.workoutIncludes?.join("\n") ?? "",
      testimonials: seededTestimonials,
    };
  });

  const payload = useMemo(() => {
    const name = formState.name.trim();
    const description = formState.description.trim();
    const durationMinutes = Number(formState.durationMinutes);
    const price = Number(formState.price);
    const workoutIncludes = formState.workoutIncludes
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const testimonials = formState.testimonials
      .map((item) => ({
        name: item.name.trim(),
        rating: Math.min(Math.max(Math.round(item.rating || 0), 1), 5),
        quote: item.quote.trim(),
      }))
      .filter((item) => item.name && item.quote);

    return {
      name,
      description: description.length ? description : null,
      durationMinutes,
      price,
      isActive: formState.isActive,
      workoutIncludes,
      testimonials,
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
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit} noValidate>
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
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Description
          </label>
          <textarea
            className={`${inputClassName} min-h-30 resize-none`}
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Short overview of the service."
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Workout includes (one per line)
          </label>
          <textarea
            className={`${inputClassName} min-h-35 resize-none`}
            value={formState.workoutIncludes}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                workoutIncludes: event.target.value,
              }))
            }
            placeholder="Movement prep and mobility warm-up"
          />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Testimonials (up to 5)
            </p>
            {formState.testimonials.length < 5 ? (
              <button
                type="button"
                className="rounded-full border border-(--brand-ink) px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    testimonials: [
                      ...prev.testimonials,
                      { name: "", rating: 5, quote: "" },
                    ],
                  }))
                }
              >
                Add
              </button>
            ) : null}
          </div>
          {formState.testimonials.map((entry, index) => (
            <div
              key={`testimonial-${index}`}
              className="grid gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-solid) p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)/70">
                  Testimonial {index + 1}
                </p>
                <button
                  type="button"
                  className="text-[0.65rem] font-semibold uppercase tracking-widest text-(--brand-ink)/70 transition hover:text-(--brand-ember)"
                  onClick={() =>
                    setFormState((prev) => {
                      const next = prev.testimonials.filter(
                        (_, entryIndex) => entryIndex !== index,
                      );
                      return { ...prev, testimonials: next };
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                <input
                  className={inputClassName}
                  placeholder="Name"
                  value={entry.name}
                  onChange={(event) =>
                    setFormState((prev) => {
                      const next = [...prev.testimonials];
                      next[index] = { ...next[index], name: event.target.value };
                      return { ...prev, testimonials: next };
                    })
                  }
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)/70">
                    Rating
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= entry.rating;
                      return (
                        <button
                          key={`${index}-star-${star}`}
                          type="button"
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
                            isActive
                              ? "border-(--brand-ember) bg-(--brand-ember) text-white"
                              : "border-(--border-subtle) text-(--brand-ink)/50 hover:border-(--brand-ember)"
                          }`}
                          aria-label={`${star} star${star === 1 ? "" : "s"}`}
                          aria-pressed={isActive}
                          onClick={() =>
                            setFormState((prev) => {
                              const next = [...prev.testimonials];
                              next[index] = { ...next[index], rating: star };
                              return { ...prev, testimonials: next };
                            })
                          }
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <textarea
                className={`${inputClassName} min-h-22.5 resize-none`}
                placeholder="Quote"
                value={entry.quote}
                onChange={(event) =>
                  setFormState((prev) => {
                    const next = [...prev.testimonials];
                    next[index] = { ...next[index], quote: event.target.value };
                    return { ...prev, testimonials: next };
                  })
                }
              />
            </div>
          ))}
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
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Price (USD)
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={formState.price}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, price: event.target.value }))
              }
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
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit} noValidate>
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
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Description
          </label>
          <textarea
            className={`${inputClassName} min-h-30 resize-none`}
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Workout includes (one per line)
          </label>
          <textarea
            className={`${inputClassName} min-h-35 resize-none`}
            value={formState.workoutIncludes}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                workoutIncludes: event.target.value,
              }))
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
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Price (USD)
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={formState.price}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, price: event.target.value }))
              }
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Testimonials (up to 5)
            </p>
            {formState.testimonials.length < 5 ? (
              <button
                type="button"
                className="rounded-full border border-(--brand-ink) px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    testimonials: [
                      ...prev.testimonials,
                      { name: "", rating: 5, quote: "" },
                    ],
                  }))
                }
              >
                Add
              </button>
            ) : null}
          </div>
          {formState.testimonials.map((entry, index) => (
            <div
              key={`testimonial-${index}`}
              className="grid gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-solid) p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)/70">
                  Testimonial {index + 1}
                </p>
                <button
                  type="button"
                  className="text-[0.65rem] font-semibold uppercase tracking-widest text-(--brand-ink)/70 transition hover:text-(--brand-ember)"
                  onClick={() =>
                    setFormState((prev) => {
                      const next = prev.testimonials.filter(
                        (_, entryIndex) => entryIndex !== index,
                      );
                      return { ...prev, testimonials: next };
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                <input
                  className={inputClassName}
                  placeholder="Name"
                  value={entry.name}
                  onChange={(event) =>
                    setFormState((prev) => {
                      const next = [...prev.testimonials];
                      next[index] = { ...next[index], name: event.target.value };
                      return { ...prev, testimonials: next };
                    })
                  }
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)/70">
                    Rating
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= entry.rating;
                      return (
                        <button
                          key={`${index}-star-${star}`}
                          type="button"
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
                            isActive
                              ? "border-(--brand-ember) bg-(--brand-ember) text-white"
                              : "border-(--border-subtle) text-(--brand-ink)/50 hover:border-(--brand-ember)"
                          }`}
                          aria-label={`${star} star${star === 1 ? "" : "s"}`}
                          aria-pressed={isActive}
                          onClick={() =>
                            setFormState((prev) => {
                              const next = [...prev.testimonials];
                              next[index] = { ...next[index], rating: star };
                              return { ...prev, testimonials: next };
                            })
                          }
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <textarea
                className={`${inputClassName} min-h-22.5 resize-none`}
                placeholder="Quote"
                value={entry.quote}
                onChange={(event) =>
                  setFormState((prev) => {
                    const next = [...prev.testimonials];
                    next[index] = { ...next[index], quote: event.target.value };
                    return { ...prev, testimonials: next };
                  })
                }
              />
            </div>
          ))}
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
