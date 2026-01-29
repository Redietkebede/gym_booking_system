export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--border-subtle) bg-(--surface) text-(--brand-ink)">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="text-lg font-semibold uppercase tracking-[0.2em]">
              Atlas Forge
            </div>
            <p className="text-sm leading-6 text-(--brand-ink)/70">
              A focused training studio built for measurable progress and
              confident movement.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
              Contact
            </div>
            <div>hello@atlasforge.co</div>
            <div>+1 234 567 8900</div>
            <div>New York, USA</div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-ember)">
              Studio Hours
            </div>
            <div>Mon - Fri: 6:00am - 8:00pm</div>
            <div>Sat: 8:00am - 4:00pm</div>
            <div>Sun: By appointment</div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 text-xs text-(--brand-ink)/60 md:flex-row md:items-center md:justify-between">
          <span>© {year} Atlas Forge. All rights reserved.</span>
          <span>Built for focused training and clear results.</span>
        </div>
      </div>
    </footer>
  );
}
