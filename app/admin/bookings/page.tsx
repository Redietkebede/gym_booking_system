import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import BookingTable from "./booking-table";
import { prisma } from "@/lib/prisma";

export default async function AdminBookingsPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect("/admin/login");
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      date: true,
      timeSlot: true,
      status: true,
      createdAt: true,
      service: {
        select: { id: true, name: true },
      },
    },
  });

  return (
    <section className="mt-6 rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
            Bookings
          </h1>
          <p className="mt-2 text-sm text-(--brand-ink)/70">
            Review and update booking status in real time.
          </p>
        </div>
        <Link
          className="w-fit rounded-full border border-(--brand-ink) px-5 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember)"
          href="/admin/bookings/new"
        >
          Create booking
        </Link>
      </div>
      <div className="mt-6">
        <BookingTable initialBookings={bookings} />
      </div>
    </section>
  );
}
