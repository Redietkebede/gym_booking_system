import PublicHeader from "../components/public-header";
import SiteFooter from "../components/site-footer";
import { prisma } from "@/lib/prisma";

const priceFormatter = new Intl.NumberFormat("en-KE");

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      durationMinutes: true,
      price: true,
      workoutIncludes: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen text-foreground">
      <PublicHeader hideServices />

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
              Studio Services
            </p>
            <h1 className="mt-3 font-(--font-display) text-4xl text-(--brand-ink) md:text-5xl">
              Sessions tuned for momentum.
            </h1>
            <p className="mt-4 text-base leading-7 text-(--brand-ink)/70">
              Every session includes a coaching brief and a tailored progression
              path. Choose a focus, book a time, and we will confirm within the day.
            </p>
          </div>
          <a
            className="btn-primary w-fit"
            href="/book"
          >
            Book a session
          </a>
        </div>

        {services.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_24px_60px_var(--shadow-color)]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-(--brand-ink)">
                    {service.name}
                  </h2>
                  <span className="rounded-full bg-(--pill-bg) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
                    {service.durationMinutes} min
                  </span>
                </div>
                {service.description ? (
                  <p className="mt-3 text-sm leading-7 text-(--brand-ink)/70">
                    {service.description}
                  </p>
                ) : null}
                {service.workoutIncludes.length ? (
                  <ul className="mt-4 grid gap-2 text-xs text-(--brand-ink)/70">
                    {service.workoutIncludes.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-(--brand-ember)" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-semibold text-(--brand-ember)">
                    USD {priceFormatter.format(service.price)}
                  </span>
                  <a
                    className="text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:text-(--brand-ember)"
                    href={`/book?serviceId=${service.id}`}
                  >
                    Book this
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 text-sm text-(--brand-ink)/70">
            No services are available right now. Please check back soon.
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
