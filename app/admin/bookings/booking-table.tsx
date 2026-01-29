"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string | Date;
  timeSlot: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string | Date;
  service: {
    id: string;
    name: string;
  };
};

type BookingTableProps = {
  initialBookings: Booking[];
};

const selectPillClass =
  "w-full appearance-none rounded-full border border-(--border-subtle) bg-(--surface-solid) px-4 py-2 pr-9 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) [background-image:linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] [background-position:calc(100%-1rem)_calc(50%-2px),calc(100%-0.7rem)_calc(50%-2px)] [background-size:5px_5px,5px_5px] [background-repeat:no-repeat]";

const statusLabels: Record<Booking["status"], string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

const statusTone: Record<Booking["status"], string> = {
  PENDING: "border-(--border-subtle) text-(--brand-ink)",
  APPROVED: "border-(--brand-ember)/40 text-(--brand-ember)",
  REJECTED: "border-(--brand-ember)/30 text-(--brand-ember)",
  COMPLETED: "border-(--brand-ink)/40 text-(--brand-ink)",
};

export default function BookingTable({ initialBookings }: BookingTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }
      if (dateFilter) {
        const bookingDate = new Date(booking.date).toISOString().slice(0, 10);
        if (bookingDate !== dateFilter) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, statusFilter, dateFilter]);

  const fetchBookings = async (nextStatus?: string, nextDate?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (nextStatus && nextStatus !== "all") {
        params.set("status", nextStatus);
      }
      if (nextDate) {
        params.set("date", nextDate);
      }
      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load bookings.");
      }
      const data = (await response.json()) as Booking[];
      setBookings(data);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, newStatus: Booking["status"]) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update booking.");
      }
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        ),
      );
    } catch (updateError) {
      console.error(updateError);
      setError("Unable to update booking.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className={selectPillClass}
          value={statusFilter}
          onChange={(event) => {
            const nextValue = event.target.value;
            setStatusFilter(nextValue);
            fetchBookings(nextValue, dateFilter);
          }}
        >
          <option value="all">All status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          type="date"
          className="rounded-full border border-(--border-subtle) bg-(--surface-solid) px-4 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink)"
          value={dateFilter}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDateFilter(nextValue);
            fetchBookings(statusFilter, nextValue);
          }}
        />
        <button
          type="button"
          className="rounded-full border border-(--brand-ink) px-4 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
          onClick={() => fetchBookings(statusFilter, dateFilter)}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing" : "Refresh"}
        </button>
        {error ? <span className="text-xs text-(--brand-ember)">{error}</span> : null}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-(--border-subtle)">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-(--surface-solid) text-xs uppercase tracking-widest text-(--brand-ink)/60">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-(--border-subtle) text-(--brand-ink)"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold">{booking.customerName}</div>
                    <div className="text-xs text-(--brand-ink)/60">
                      {booking.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 py-4">{booking.service.name}</td>
                  <td className="px-4 py-4">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">{booking.timeSlot}</td>
                  <td className="px-4 py-4">
                    <select
                      className={`${selectPillClass} ${statusTone[booking.status]}`}
                      value={booking.status}
                      onChange={(event) =>
                        updateStatus(
                          booking.id,
                          event.target.value as Booking["status"],
                        )
                      }
                      disabled={isLoading}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-xs text-(--brand-ink)/70">
                    {new Date(booking.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) px-3 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
                      href={`/admin/bookings/${booking.id}`}
                    >
                      <svg
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 20h4l10.5-10.5a2.828 2.828 0 0 0-4-4L4 16v4Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.5 6.5l4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-(--brand-ink)/60">
                  {isLoading ? "Loading bookings..." : "No bookings found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
