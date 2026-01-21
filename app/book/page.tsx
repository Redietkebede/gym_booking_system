import ThemeToggle from "../components/theme-toggle";

const serviceOptions = [
  "Strength Foundations",
  "Athletic Conditioning",
  "Mobility Reset",
  "Power Circuit",
  "Performance Sprint",
];

export default function BookPage() {
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
              Call +254 712 345 678 or email hello@atlasforge.co. We can tailor a
              plan before your first visit.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_30px_90px_var(--shadow-color)] md:p-8">
          <form className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
              Service
              <select className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)">
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
                Date
                <input
                  type="date"
                  className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
                Time
                <input
                  type="time"
                  className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
              Full name
              <input
                type="text"
                placeholder="Jane Doe"
                className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
              />
            </label>
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
                Email
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
                Phone
                <input
                  type="tel"
                  placeholder="+254 7xx xxx xxx"
                  className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-2 rounded-full border border-(--brand-ink) px-6 py-4 text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember)"
            >
              Submit booking
            </button>
            <p className="text-xs text-(--brand-ink)/60">
              This form is UI-only for now. We will connect it to the booking API
              in the next step.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
