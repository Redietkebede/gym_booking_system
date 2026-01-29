"use client";

import { useMemo, useState } from "react";

type ServiceOption = {
  id: string;
  name: string;
};

type BookingFormProps = {
  services: ServiceOption[];
  initialServiceId?: string;
};

type FormState = {
  serviceId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

const emptyState: FormState = {
  serviceId: "",
  date: "",
  timeSlot: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookingForm({
  services,
  initialServiceId,
}: BookingFormProps) {
  const preferredService = useMemo(() => {
    if (!services.length) {
      return "";
    }

    if (initialServiceId && services.some((service) => service.id === initialServiceId)) {
      return initialServiceId;
    }

    return services[0].id;
  }, [initialServiceId, services]);

  const [formState, setFormState] = useState<FormState>(() => ({
    ...emptyState,
    serviceId: preferredService,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const minDate = useMemo(() => formatLocalDate(new Date()), []);
  const isFormDisabled = isSubmitting || services.length === 0;

  const updateField = (field: keyof FormState, value: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formState.serviceId) {
      nextErrors.serviceId = "Please select a service.";
    }
    if (!formState.date) {
      nextErrors.date = "Please select a date.";
    }
    if (!formState.timeSlot) {
      nextErrors.timeSlot = "Please select a time.";
    }
    if (!formState.customerName.trim()) {
      nextErrors.customerName = "Please enter your name.";
    }
    if (!formState.customerEmail.trim()) {
      nextErrors.customerEmail = "Please enter your email.";
    } else if (!emailPattern.test(formState.customerEmail.trim())) {
      nextErrors.customerEmail = "Enter a valid email address.";
    }
    if (!formState.customerPhone.trim()) {
      nextErrors.customerPhone = "Please enter your phone number.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !data.success) {
        setError(data.error ?? "Unable to submit booking.");
        return;
      }

      setSuccess("Booking received. We will confirm within 24 hours.");
      setFieldErrors({});
      setFormState((prev) => ({
        ...emptyState,
        serviceId: prev.serviceId,
      }));
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
        Service
        <select
          className="w-full appearance-none rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 pr-12 text-base text-(--brand-ink) [background-image:linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] [background-position:calc(100%-1.25rem)_calc(50%-3px),calc(100%-0.95rem)_calc(50%-3px)] [background-size:6px_6px,6px_6px] [background-repeat:no-repeat]"
          value={formState.serviceId}
          onChange={(event) => updateField("serviceId", event.target.value)}
          required
          disabled={isFormDisabled}
          aria-invalid={fieldErrors.serviceId ? "true" : "false"}
        >
          {services.length ? (
            services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))
          ) : (
            <option value="">No services available</option>
          )}
        </select>
        {fieldErrors.serviceId ? (
          <span className="text-xs text-(--brand-ember)">
            {fieldErrors.serviceId}
          </span>
        ) : services.length === 0 ? (
          <span className="text-xs text-(--brand-ink)/60">
            Services are currently unavailable. Please check back soon.
          </span>
        ) : null}
      </label>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Date
          <input
            type="date"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.date}
            onChange={(event) => updateField("date", event.target.value)}
            min={minDate}
            disabled={isFormDisabled}
            aria-invalid={fieldErrors.date ? "true" : "false"}
          />
          {fieldErrors.date ? (
            <span className="text-xs text-(--brand-ember)">{fieldErrors.date}</span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Time
          <input
            type="time"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.timeSlot}
            onChange={(event) => updateField("timeSlot", event.target.value)}
            disabled={isFormDisabled}
            aria-invalid={fieldErrors.timeSlot ? "true" : "false"}
          />
          {fieldErrors.timeSlot ? (
            <span className="text-xs text-(--brand-ember)">
              {fieldErrors.timeSlot}
            </span>
          ) : null}
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
        Full name
        <input
          type="text"
          placeholder="Jane Doe"
          className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
          value={formState.customerName}
          onChange={(event) => updateField("customerName", event.target.value)}
          disabled={isFormDisabled}
          aria-invalid={fieldErrors.customerName ? "true" : "false"}
        />
        {fieldErrors.customerName ? (
          <span className="text-xs text-(--brand-ember)">
            {fieldErrors.customerName}
          </span>
        ) : null}
      </label>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Email
          <input
            type="email"
            placeholder="you@example.com"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.customerEmail}
            onChange={(event) => updateField("customerEmail", event.target.value)}
            disabled={isFormDisabled}
            aria-invalid={fieldErrors.customerEmail ? "true" : "false"}
          />
          {fieldErrors.customerEmail ? (
            <span className="text-xs text-(--brand-ember)">
              {fieldErrors.customerEmail}
            </span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Phone
          <input
            type="tel"
            placeholder="+254 7xx xxx xxx"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.customerPhone}
            onChange={(event) => updateField("customerPhone", event.target.value)}
            disabled={isFormDisabled}
            aria-invalid={fieldErrors.customerPhone ? "true" : "false"}
          />
          {fieldErrors.customerPhone ? (
            <span className="text-xs text-(--brand-ember)">
              {fieldErrors.customerPhone}
            </span>
          ) : null}
        </label>
      </div>
      <button
        type="submit"
        className="btn-primary mt-2"
        disabled={isFormDisabled}
      >
        {isSubmitting ? "Submitting..." : "Submit booking"}
      </button>
      {error ? (
        <p className="text-xs text-(--brand-ember)">{error}</p>
      ) : success ? (
        <p className="text-xs text-(--brand-ink)/70">{success}</p>
      ) : (
        <p className="text-xs text-(--brand-ink)/60">
          We will confirm your booking by email and SMS within 24 hours.
        </p>
      )}
    </form>
  );
}
