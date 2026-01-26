import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "../booking-form";

export default async function NewBookingPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect("/admin/login");
  }

  const services = await prisma.service.findMany({
    select: { id: true, name: true, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="mt-6 rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
            Create booking
          </h1>
          <p className="mt-2 text-sm text-(--brand-ink)/70">
            Add a booking on behalf of a customer.
          </p>
        </div>
        <Link
          className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:text-(--brand-ember)"
          href="/admin/bookings"
        >
          Back to bookings
        </Link>
      </div>
      <BookingForm services={services} />
    </section>
  );
}
