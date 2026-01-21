import ThemeToggle from "../components/theme-toggle";

const services = [
  {
    name: "Strength Foundations",
    description: "Barbell coaching with a focus on hinge, squat, and press.",
    duration: "60 min",
    price: "2,500",
  },
  {
    name: "Athletic Conditioning",
    description: "Intervals and sled work to build a relentless engine.",
    duration: "45 min",
    price: "2,000",
  },
  {
    name: "Mobility Reset",
    description: "Deep mobility flow to restore hips, shoulders, and spine.",
    duration: "40 min",
    price: "1,800",
  },
  {
    name: "Power Circuit",
    description: "Kettlebell and bodyweight circuit with a sharp finisher.",
    duration: "50 min",
    price: "2,200",
  },
  {
    name: "Performance Sprint",
    description: "Explosive work focused on speed, rhythm, and recovery.",
    duration: "35 min",
    price: "1,900",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--page-gradient)] text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <a
          className="text-lg font-semibold uppercase tracking-[0.2em] text-(--brand-ink)"
          href="/"
        >
          Atlas Forge
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-(--brand-ink)">
          <a className="transition hover:text-(--brand-ember)" href="/services">
            Services
          </a>
          <a className="transition hover:text-(--brand-ember)" href="/book">
            Book Now
          </a>
          <ThemeToggle className="text-xs" />
        </nav>
      </header>

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
            className="w-fit rounded-full border border-(--brand-ink) px-6 py-3 text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember)"
            href="/book"
          >
            Book a session
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.name}
              className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_24px_60px_var(--shadow-color)]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-(--brand-ink)">
                  {service.name}
                </h2>
                <span className="rounded-full bg-(--brand-sand) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--brand-ink)">
                  {service.duration}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-(--brand-ink)/70">
                {service.description}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-semibold text-(--brand-ember)">
                  ETB {service.price}
                </span>
                <a
                  className="text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:text-(--brand-ember)"
                  href="/book"
                >
                  Book this
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
