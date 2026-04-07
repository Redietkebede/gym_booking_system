"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formInputClassName } from "@/components/ui/form-classnames";
import ToastNotice from "@/components/ui/toast-notice";
import { useToast } from "@/hooks/use-toast";
import { assertResponseOk, reportClientError } from "@/lib/http-client";

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

const MAX_TESTIMONIALS = 5;

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
    const trimmedTestimonials = testimonials.slice(0, MAX_TESTIMONIALS);
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

type ServiceFormProps = {
  initialService?: Service;
};

function ServiceForm({ initialService }: ServiceFormProps) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const { formState, setFormState, payload } = useServiceForm(initialService);

  const isEditMode = Boolean(initialService);
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
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditMode && initialService
            ? { id: initialService.id, ...payload }
            : payload,
        ),
      });

      assertResponseOk(
        response,
        isEditMode ? "Failed to update service." : "Failed to create service.",
      );

      setToast({
        message: isEditMode ? "Service updated." : "Service created.",
        tone: "success",
      });

      if (isEditMode) {
        router.refresh();
      } else {
        router.push("/admin/services");
        router.refresh();
      }
    } catch (error) {
      reportClientError(error);
      setToast({
        message: isEditMode ? "Unable to update service." : "Unable to create service.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!initialService) {
      return;
    }

    const nextIsActive = !formState.isActive;

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialService.id,
          isActive: nextIsActive,
        }),
      });

      assertResponseOk(response, "Failed to update status.");

      setFormState((prev) => ({ ...prev, isActive: nextIsActive }));
      setToast({
        message: `Service marked ${nextIsActive ? "active" : "inactive"}.`,
        tone: "success",
      });
      router.refresh();
    } catch (error) {
      reportClientError(error);
      setToast({ message: "Unable to update status.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialService) {
      return;
    }

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

      assertResponseOk(response, "Failed to delete service.");

      setToast({ message: "Service deleted.", tone: "success" });
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      reportClientError(error);
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
            className={formInputClassName}
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder={isEditMode ? undefined : "Strength Foundations"}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Description
          </label>
          <textarea
            className={`${formInputClassName} min-h-30 resize-none`}
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder={isEditMode ? undefined : "Short overview of the service."}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
            Workout includes (one per line)
          </label>
          <textarea
            className={`${formInputClassName} min-h-35 resize-none`}
            value={formState.workoutIncludes}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                workoutIncludes: event.target.value,
              }))
            }
            placeholder={isEditMode ? undefined : "Movement prep and mobility warm-up"}
          />
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Testimonials (up to {MAX_TESTIMONIALS})
            </p>
            {formState.testimonials.length < MAX_TESTIMONIALS ? (
              <button
                type="button"
                className="rounded-full border border-(--brand-ink) px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    testimonials: [...prev.testimonials, { name: "", rating: 5, quote: "" }],
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
                    setFormState((prev) => ({
                      ...prev,
                      testimonials: prev.testimonials.filter(
                        (_, entryIndex) => entryIndex !== index,
                      ),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                <input
                  className={formInputClassName}
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
                className={`${formInputClassName} min-h-22.5 resize-none`}
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
              className={formInputClassName}
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
              className={formInputClassName}
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
            {isSaving ? "Saving" : isEditMode ? "Save changes" : "Create service"}
          </button>

          {isEditMode ? (
            <>
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
            </>
          ) : (
            <button
              type="button"
              className="rounded-full border border-(--brand-ink) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
              onClick={() => router.push("/admin/services")}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export function NewServiceForm() {
  return <ServiceForm />;
}

export function EditServiceForm({ initialService }: { initialService: Service }) {
  return <ServiceForm initialService={initialService} />;
}
