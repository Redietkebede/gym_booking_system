import PublicHeader from "./components/public-header";
import SiteFooter from "./components/site-footer";
import { prisma } from "@/lib/prisma";

type Testimonial = {
  name: string;
  rating: number;
  quote: string;
  serviceId: string;
  serviceName: string;
};

export default async function Home() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      durationMinutes: true,
      price: true,
      workoutIncludes: true,
      testimonials: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const testimonials = services.flatMap((service) => {
    if (!Array.isArray(service.testimonials)) {
      return [];
    }
    return service.testimonials
      .map((entry: unknown) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }
        const entryRecord = entry as Record<string, unknown>;
        const name =
          typeof entryRecord.name === "string" ? entryRecord.name : "";
        const rating =
          typeof entryRecord.rating === "number" &&
          Number.isFinite(entryRecord.rating)
            ? Math.min(Math.max(Math.round(entryRecord.rating), 1), 5)
            : 5;
        const quote =
          typeof entryRecord.quote === "string" ? entryRecord.quote : "";
        if (!name || !quote) {
          return null;
        }
        return {
          name,
          rating,
          quote,
          serviceId: service.id,
          serviceName: service.name,
        } as Testimonial;
      })
      .filter((entry: any): entry is Testimonial => Boolean(entry));
  });

  const featuredTestimonials = testimonials.length
    ? [...testimonials].sort(() => 0.5 - Math.random()).slice(0, 5)
    : [];
  const marqueeItems = featuredTestimonials.length
    ? [...featuredTestimonials, ...featuredTestimonials]
    : [];
  const rhythmSessions = services.length
    ? [...services].sort(() => 0.5 - Math.random()).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen text-foreground">
      <PublicHeader showAdmin />

      <main className="mx-auto grid w-full max-w-6xl gap-16 px-6 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <section className="flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-(--brand-ink) px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ink)">
            New Season Openings
          </div>
          <h1 className="text-balance font-(--font-display) text-4xl leading-tight text-(--brand-ink) md:text-6xl">
            Build strength that looks inevitable, not accidental.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-(--brand-ink)/80">
            Gym Booking System is a focused training studio for people who want sessions
            with structure, coaching, and measurable progress. Pick a service,
            choose a slot, and we will handle the rest.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              className="btn-primary"
              href="/book"
            >
              Book Now
            </a>
            <a
              className="btn-ghost"
              href="/services"
            >
              View Services
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-(--brand-ink)">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-(--metric-accent)">12+</span>
              Coaching programs
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-(--metric-accent)">4.9</span>
              Member rating
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-(--metric-accent)">24h</span>
              Response time
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_30px_90px_var(--shadow-color)]">
            <h2 className="font-(--font-display) text-2xl text-(--brand-ink)">
              Studio Rhythm
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--brand-ink)/70">
              Studio Rhythm is the session flow you can expect in every visit.
              Use it to compare the time and focus of the next three available
              sessions before you book.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              {rhythmSessions.length ? (
                rhythmSessions.map((session) => (
                  <a
                    key={session.id}
                    href={`/book?serviceId=${session.id}`}
                    className="flex items-center justify-between rounded-2xl bg-(--pill-bg) px-4 py-3 transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                    aria-label={`Book ${session.name}`}
                  >
                    <span>{session.name}</span>
                    <span className="font-semibold text-(--brand-ember)">
                      {session.durationMinutes} min
                    </span>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl bg-(--pill-bg) px-4 py-3 text-(--brand-ink)/70">
                  No sessions available yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-(--border-subtle) bg-(--panel-strong) p-6 text-(--panel-strong-foreground)">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-(--brand-copper)">
              The promise
            </h3>
            <p className="mt-3 text-lg leading-7">
              Expect a clean plan, immediate feedback, and the exact amount of
              pressure you need to move forward.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--brand-copper)"
              href="/book"
            >
              Claim a spot →
            </a>
          </div>
        </section>
      </main>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
              Choose a session
            </p>
            <h2 className="mt-3 font-(--font-display) text-3xl text-(--brand-ink) md:text-4xl">
              Pick the workout that matches your goal.
            </h2>
            <p className="mt-4 text-base leading-7 text-(--brand-ink)/70">
              Each session includes a clear structure and coaching notes. Select a
              session to prefill your booking.
            </p>
          </div>
          <a
            className="btn-ghost w-fit"
            href="/services"
          >
            View all services
          </a>
        </div>

        {services.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_24px_60px_var(--shadow-color)]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-(--brand-ink)">
                    {service.name}
                  </h3>
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
                    USD {service.price.toLocaleString("en-KE")}
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
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
            Testimonials
          </p>
          <h2 className="font-(--font-display) text-3xl text-(--brand-ink) md:text-4xl">
            Members describe there sessions.
          </h2>
        </div>

        {featuredTestimonials.length ? (
          <div className="marquee mt-8 overflow-hidden rounded-3xl border border-(--border-subtle) bg-(--surface) py-6">
            <div className="marquee-track flex gap-6 px-6">
              {marqueeItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="min-w-65 max-w-[320px] flex-1 rounded-2xl border border-(--border-subtle) bg-(--surface-solid) p-5 text-sm text-(--brand-ink)"
                >
                  <p className="text-base leading-7 text-(--brand-ink)/80">
                    “{item.quote}”
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-(--brand-ember)">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={`${item.name}-${starIndex}`}
                        className={
                          starIndex < item.rating
                            ? "text-(--brand-ember)"
                            : "text-(--brand-ink)/30"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-xs uppercase tracking-[0.3em] text-(--brand-ember)">
                    {item.serviceName}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 text-sm text-(--brand-ink)/70">
            Testimonials will be added soon.
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
