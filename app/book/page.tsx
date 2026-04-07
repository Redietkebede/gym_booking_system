import PublicHeader from "../components/public-header";
import BookingForm from "./booking-form";
import SiteFooter from "../components/site-footer";
import { prisma } from "@/lib/prisma";

type BookPageProps = {
  searchParams?: Record<string, string | string[]>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });
  const initialServiceId =
    typeof searchParams?.serviceId === "string" ? searchParams.serviceId : undefined;

  return (
    <div className="min-h-screen text-foreground">
      <PublicHeader hideBooking />

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-6 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <section className="flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
            Book a Session
          </p>
          <h1 className="font-(--font-display) text-4xl text-(--brand-ink) md:text-5xl">
            Reserve your next session in minutes.
          </h1>
          <p className="text-base leading-7 text-(--brand-ink)/70">
            Share the service you want, a date, and your contact details. We will
            confirm your booking by email and SMS within 24 hours.
          </p>
          <div className="rounded-3xl border border-(--border-subtle) bg-(--panel-strong) p-6 text-(--panel-strong-foreground)">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-(--brand-copper)">
              Need help?
            </h2>
            <p className="mt-3 text-base leading-7">
              Call +254 712 345 678 or email hello@gymbookingsystem.com. We can tailor a
              plan before your first visit.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_30px_90px_var(--shadow-color)] md:p-8">
          <BookingForm services={services} initialServiceId={initialServiceId} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
