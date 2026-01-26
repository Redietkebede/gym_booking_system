import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "../booking-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookingPage({ params }: PageProps) {
  const session = await requireAdmin();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  if (!id) {
    notFound();
  }

  const [booking, services] = await Promise.all([
    prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        serviceId: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        date: true,
        timeSlot: true,
        status: true,
      },
    }),
    prisma.service.findMany({
      select: { id: true, name: true, isActive: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!booking) {
    redirect("/admin/bookings");
  }

  return (
    <section className="mt-6 rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
            Edit booking
          </h1>
          <p className="mt-2 text-sm text-(--brand-ink)/70">
            Update the customer details or schedule.
          </p>
        </div>
        <Link
          className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:text-(--brand-ember)"
          href="/admin/bookings"
        >
          Back to bookings
        </Link>
      </div>
      <BookingForm
        services={services}
        initialBooking={{
          ...booking,
          date: booking.date.toISOString(),
        }}
      />
    </section>
  );
}
