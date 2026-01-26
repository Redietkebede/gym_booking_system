import ThemeToggle from "../components/theme-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <a
          className="text-lg font-semibold uppercase tracking-[0.2em] text-(--brand-ink)"
          href="/"
        >
          Atlas Forge
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-(--brand-ink)">
          <a className="transition hover:text-(--brand-ember)" href="/admin/bookings">
            Bookings
          </a>
          <a className="transition hover:text-(--brand-ember)" href="/admin/services">
            Services
          </a>
          <ThemeToggle className="text-xs" />
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        {children}
      </main>
    </div>
  );
}
