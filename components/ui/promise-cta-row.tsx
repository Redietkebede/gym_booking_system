"use client";

import { motion } from "framer-motion";

export default function PromiseCtaRow() {
  return (
    <section className="mt-4 grid gap-6 md:col-span-2 md:mt-8 md:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ x: -56, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-3xl border border-(--border-subtle) bg-(--panel-strong) p-6 text-(--panel-strong-foreground)"
      >
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-(--brand-copper)">
          The promise
        </h3>
        <p className="mt-3 text-lg leading-7">
          Expect a clean plan, immediate feedback, and the exact amount of
          pressure you need to move forward. Every session is built with
          purpose, so you know what you are working on, why it matters, and how
          it connects to your next milestone. You get clear coaching, practical
          progress checks, and training that stays challenging without becoming
          chaotic.
        </p>
      </motion.div>

      <motion.div
        initial={{ x: 56, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
        className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-6 shadow-[0_24px_60px_var(--shadow-color)]"
      >
        <div className="flex flex-wrap gap-4">
          <a className="btn-primary" href="/book">
            Book Now
          </a>
          <a className="btn-ghost" href="/services">
            View Services
          </a>
        </div>
        <div className="mt-6 grid gap-4 text-sm font-medium text-(--brand-ink) sm:grid-cols-3">
          <div className="flex flex-col rounded-2xl bg-(--pill-bg) px-4 py-3">
            <span className="text-2xl font-semibold text-(--metric-accent)">12+</span>
            Coaching programs
          </div>
          <div className="flex flex-col rounded-2xl bg-(--pill-bg) px-4 py-3">
            <span className="text-2xl font-semibold text-(--metric-accent)">4.9</span>
            Member rating
          </div>
          <div className="flex flex-col rounded-2xl bg-(--pill-bg) px-4 py-3">
            <span className="text-2xl font-semibold text-(--metric-accent)">24h</span>
            Response time
          </div>
        </div>
      </motion.div>
    </section>
  );
}
