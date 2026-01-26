"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type ServiceOption = {
  id: string;
  name: string;
  isActive: boolean;
};

type Booking = {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
};

type Toast = {
  message: string;
  tone: "success" | "error";
};

type BookingFormState = {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: Booking["status"];
};

const statusOptions: Booking["status"][] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const emptyState: BookingFormState = {
  serviceId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  date: "",
  timeSlot: "",
  status: "PENDING",
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

function toDateInputValue(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function useBookingForm(initial?: Booking) {
  const [formState, setFormState] = useState<BookingFormState>(() => {
    if (!initial) {
      return emptyState;
    }
    return {
      serviceId: initial.serviceId,
      customerName: initial.customerName,
      customerEmail: initial.customerEmail,
      customerPhone: initial.customerPhone,
      date: toDateInputValue(initial.date),
      timeSlot: initial.timeSlot,
      status: initial.status,
    };
  });

  const payload = useMemo(() => {
    const name = formState.customerName.trim();
    const email = formState.customerEmail.trim();
    const phone = formState.customerPhone.trim();

    return {
      serviceId: formState.serviceId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      date: formState.date,
      timeSlot: formState.timeSlot.trim(),
      status: formState.status,
    };
  }, [formState]);

  return { formState, setFormState, payload };
}

type BookingFormProps = {
  services: ServiceOption[];
  initialBooking?: Booking;
};

export function BookingForm({ services, initialBooking }: BookingFormProps) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const { formState, setFormState, payload } = useBookingForm(initialBooking);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !payload.serviceId ||
      !payload.customerName ||
      !payload.customerEmail ||
      !payload.customerPhone ||
      !payload.date ||
      !payload.timeSlot
    ) {
      setToast({ message: "All fields are required.", tone: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: initialBooking ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          initialBooking
            ? { bookingId: initialBooking.id, ...payload }
            : payload,
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save booking.");
      }

      setToast({
        message: initialBooking ? "Booking updated." : "Booking created.",
        tone: "success",
      });

      router.push("/admin/bookings");
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({ message: "Unable to save booking.", tone: "error" });
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
            Service
          </label>
          <select
            className={inputClassName}
            value={formState.serviceId}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, serviceId: event.target.value }))
            }
            required
          >
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
                {!service.isActive ? " (inactive)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Date
            </label>
            <input
              type="date"
              className={inputClassName}
              value={formState.date}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, date: event.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Time slot
            </label>
            <input
              type="time"
              className={inputClassName}
              value={formState.timeSlot}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, timeSlot: event.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Customer name
            </label>
            <input
              className={inputClassName}
              value={formState.customerName}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  customerName: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Customer email
            </label>
            <input
              type="email"
              className={inputClassName}
              value={formState.customerEmail}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  customerEmail: event.target.value,
                }))
              }
              required
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
              Customer phone
            </label>
            <input
              className={inputClassName}
              value={formState.customerPhone}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  customerPhone: event.target.value,
                }))
              }
              required
            />
          </div>
          {initialBooking ? (
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
                Status
              </label>
              <select
                className={inputClassName}
                value={formState.status}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: event.target.value as Booking["status"],
                  }))
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-(--cta-bg) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--cta-fg) transition hover:-translate-y-px hover:bg-(--cta-hover)"
            disabled={isSaving}
          >
            {isSaving ? "Saving" : initialBooking ? "Save changes" : "Create booking"}
          </button>
          {initialBooking ? (
            <button
              type="button"
              className="rounded-full border border-(--brand-ember) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ember) transition hover:-translate-y-px"
              onClick={async () => {
                const shouldDelete = window.confirm(
                  "Delete this booking? This cannot be undone.",
                );
                if (!shouldDelete) {
                  return;
                }
                setIsDeleting(true);
                try {
                  const response = await fetch("/api/admin/bookings", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId: initialBooking.id }),
                  });
                  if (!response.ok) {
                    throw new Error("Failed to delete booking.");
                  }
                  setToast({ message: "Booking deleted.", tone: "success" });
                  router.push("/admin/bookings");
                  router.refresh();
                } catch (error) {
                  console.error(error);
                  setToast({ message: "Unable to delete booking.", tone: "error" });
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting" : "Delete"}
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-full border border-(--brand-ink) px-6 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
            onClick={() => router.push("/admin/bookings")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
