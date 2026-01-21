import ThemeToggle from "./components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--page-gradient)] text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <div className="text-lg font-semibold uppercase tracking-[0.2em] text-(--brand-ink)">
          Atlas Forge
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-(--brand-ink)">
          <a className="transition hover:text-(--brand-ember)" href="/services">
            Services
          </a>
          <a className="transition hover:text-(--brand-ember)" href="/book">
            Book Now
          </a>
          <a className="transition hover:text-(--brand-ember)" href="/admin/login">
            Admin
          </a>
          <ThemeToggle className="text-xs" />
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-16 px-6 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <section className="flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-(--brand-ink) px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ink)">
            New Season Openings
          </div>
          <h1 className="text-balance font-(--font-display) text-4xl leading-tight text-(--brand-ink) md:text-6xl">
            Build strength that looks inevitable, not accidental.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-(--brand-ink)/80">
            Atlas Forge is a focused training studio for people who want sessions
            with structure, coaching, and measurable progress. Pick a service,
            choose a slot, and we will handle the rest.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              className="rounded-full border border-(--brand-ink) px-6 py-3 text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember)"
              href="/book"
            >
              Book Now
            </a>
            <a
              className="rounded-full border border-(--brand-ink) px-6 py-3 text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
              href="/services"
            >
              View Services
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-(--brand-ink)">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-(--brand-ember)">12+</span>
              Coaching programs
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-(--brand-ember)">4.9</span>
              Member rating
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-(--brand-ember)">24h</span>
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
              Each session is designed for clarity: warm-up, skill work, strength,
              and a closing finisher tailored to your goal.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-(--brand-sand) px-4 py-3">
                <span>Strength Foundations</span>
                <span className="font-semibold text-(--brand-ember)">60 min</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-(--brand-sand) px-4 py-3">
                <span>Athletic Conditioning</span>
                <span className="font-semibold text-(--brand-ember)">45 min</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-(--brand-sand) px-4 py-3">
                <span>Mobility Reset</span>
                <span className="font-semibold text-(--brand-ember)">40 min</span>
              </div>
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
    </div>
  );
}
