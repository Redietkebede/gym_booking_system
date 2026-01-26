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

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formState.serviceId) {
      setError("Please select a service.");
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
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
        Service
        <select
          className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
          value={formState.serviceId}
          onChange={(event) => updateField("serviceId", event.target.value)}
          disabled={!services.length || isSubmitting}
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Date
          <input
            type="date"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.date}
            onChange={(event) => updateField("date", event.target.value)}
            disabled={isSubmitting}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Time
          <input
            type="time"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.timeSlot}
            onChange={(event) => updateField("timeSlot", event.target.value)}
            disabled={isSubmitting}
          />
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
          disabled={isSubmitting}
        />
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
            disabled={isSubmitting}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Phone
          <input
            type="tel"
            placeholder="+254 7xx xxx xxx"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={formState.customerPhone}
            onChange={(event) => updateField("customerPhone", event.target.value)}
            disabled={isSubmitting}
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-2 rounded-full border border-(--brand-ink) px-6 py-4 text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember) disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting || !services.length}
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
