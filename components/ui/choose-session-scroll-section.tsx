"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type SessionService = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  workoutIncludes: string[];
};

type ChooseSessionScrollSectionProps = {
  services: SessionService[];
};

const SESSION_IMAGES = [
  "/assets/session-images/session-1.jpg",
  "/assets/session-images/session-2.jpg",
  "/assets/session-images/session-3.jpg",
  "/assets/session-images/session-4.jpg",
];

type AnimatedServiceRowProps = {
  service: SessionService;
  imageUrl: string;
  reverse?: boolean;
};

function AnimatedServiceRow({
  service,
  imageUrl,
  reverse = false,
}: AnimatedServiceRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 92%", "center 60%"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [42, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const imageClip = useTransform(
    scrollYProgress,
    [0.1, 0.85],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );

  return (
    <div
      ref={rowRef}
      className={`flex min-h-[70vh] items-center gap-10 py-8 md:gap-24 md:py-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="max-w-xl"
      >
        <h3 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
          {service.name}
        </h3>
        <p className="mt-7 text-lg leading-9 text-white/68">
          {service.description && service.description.trim().length
            ? service.description
            : "Coach-led structured training designed for measurable progress and consistent results."}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/30 px-4 py-1 text-sm uppercase tracking-[0.18em] text-white/80">
            {service.durationMinutes} min
          </span>
          <span className="rounded-full border border-white/30 px-4 py-1 text-sm uppercase tracking-[0.18em] text-white/80">
            USD {service.price.toLocaleString("en-KE")}
          </span>
          <a
            href={`/book?serviceId=${service.id}`}
            className="rounded-full border border-[#c57a5e] px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#c57a5e] transition hover:bg-[#c57a5e] hover:text-black"
          >
            Book this
          </a>
        </div>
      </motion.div>

      <motion.div
        style={{
          opacity: imageOpacity,
          clipPath: imageClip,
          backgroundImage: `url(${imageUrl})`,
        }}
        role="img"
        aria-label={service.name}
        className="h-[320px] w-[280px] shrink-0 rounded-sm border border-white/10 bg-cover bg-center shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:h-[430px] md:w-[320px]"
      />
    </div>
  );
}

export default function ChooseSessionScrollSection({
  services,
}: ChooseSessionScrollSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "start 35%"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);

  return (
    <section ref={sectionRef} className="w-full bg-[#06070a] py-14 md:py-20">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-end md:justify-between md:px-10"
        style={{ y: headingY, opacity: headingOpacity }}
      >
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c57a5e]">
            Choose a session
          </p>
          <h2 className="mt-3 font-(--font-display) text-3xl text-white md:text-4xl">
            Pick the workout that matches your goal.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/65">
            Each session includes a clear structure and coaching notes. Select a
            session to prefill your booking.
          </p>
        </div>
        <a
          className="w-fit rounded-full border border-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#c57a5e] hover:text-[#c57a5e]"
          href="/services"
        >
          View all services
        </a>
      </motion.div>

      {services.length ? (
        <motion.div
          className="mx-auto mt-8 w-full max-w-6xl px-6 md:mt-10 md:px-10"
          style={{ y: gridY, opacity: gridOpacity }}
        >
          {services.map((service, index) => (
            <AnimatedServiceRow
              key={service.id}
              service={service}
              imageUrl={SESSION_IMAGES[index % SESSION_IMAGES.length]}
              reverse={index % 2 === 1}
            />
          ))}
        </motion.div>
      ) : (
        <div className="mx-auto mt-10 w-full max-w-6xl px-6 md:px-10">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-sm text-white/65">
            No services are available right now. Please check back soon.
          </div>
        </div>
      )}
    </section>
  );
}
