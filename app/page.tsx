import PublicHeader from "./components/public-header";
import SiteFooter from "./components/site-footer";
import { prisma } from "@/lib/prisma";
import ChooseSessionScrollSection from "@/components/ui/choose-session-scroll-section";
import PromiseCtaRow from "@/components/ui/promise-cta-row";

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
    ? [...services].sort(() => 0.5 - Math.random()).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen text-foreground">
      <PublicHeader showAdmin />

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:gap-x-10 md:gap-y-8 md:px-10">
        <section className="flex flex-col gap-8 md:pr-2">
          <h1 className="text-balance font-(--font-display) text-4xl leading-tight text-(--brand-ink) md:text-6xl">
            Build strength that looks inevitable, not accidental.
          </h1>
          <p className="max-w-none text-lg leading-8 text-(--brand-ink)/80 md:max-w-[42rem]">
            Gym Booking System is built to make training consistent, accountable,
            and easy to manage from first booking to completed session. Members
            get a clear path: choose the right service, reserve a slot in
            minutes, and arrive knowing the session goal. The platform keeps the
            process simple and measurable for both members and coaches.
          </p>
        </section>

        <section className="md:flex">
          <div className="w-full rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_30px_90px_var(--shadow-color)] md:h-full">
            <h2 className="font-(--font-display) text-2xl text-(--brand-ink)">
              Studio Rhythm
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--brand-ink)/70">
              Studio Rhythm is the session flow you can expect in every visit.
              Use it to compare the time and focus of the next four available
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
        </section>

        <PromiseCtaRow />
      </main>

      <ChooseSessionScrollSection services={services.slice(0, 4)} />

      <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-24 md:px-10 md:pt-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
            Testimonials
          </p>
          <h2 className="font-(--font-display) text-3xl text-(--brand-ink) md:text-4xl">
            Members describe there sessions.
          </h2>
        </div>

        {featuredTestimonials.length ? (
          <div className="marquee mt-10 overflow-hidden rounded-3xl border border-(--border-subtle) bg-(--surface) py-8">
            <div className="marquee-track flex gap-8 px-6">
              {marqueeItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="w-[320px] shrink-0 rounded-2xl border border-(--border-subtle) bg-(--surface-solid) p-5 text-sm text-(--brand-ink)"
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
