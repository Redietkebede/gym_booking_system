"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import ThemeToggle from "./theme-toggle";

type PublicHeaderProps = {
  showAdmin?: boolean;
  hideServices?: boolean;
  hideBooking?: boolean;
};

export default function PublicHeader({
  showAdmin = false,
  hideServices = false,
  hideBooking = false,
}: PublicHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
      <Link
        className="flex items-center gap-3 text-lg font-semibold uppercase tracking-[0.2em] text-(--brand-ink)"
        href="/"
      >
        <Image
          src="/assets/brand/logo-mark-light.svg"
          alt="Gym Booking System logo light"
          width={32}
          height={32}
          className="brand-logo-light h-8 w-8 rounded-full border border-(--border-subtle) bg-(--surface-solid) p-1"
        />
        <Image
          src="/assets/brand/logo-mark-dark.svg"
          alt="Gym Booking System logo dark"
          width={32}
          height={32}
          className="brand-logo-dark h-8 w-8 rounded-full border border-(--border-subtle) bg-(--surface-solid) p-1"
        />
        Gym Booking System
      </Link>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          className="btn-ghost btn-sm flex items-center gap-3"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
          <span className="grid gap-1">
            <span className="h-0.5 w-5 rounded-full bg-(--brand-ink)" />
            <span className="h-0.5 w-5 rounded-full bg-(--brand-ink)" />
          </span>
        </button>
        {open ? (
          <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-(--border-subtle) bg-(--surface-solid) p-3 text-sm text-(--brand-ink) shadow-[0_20px_45px_var(--shadow-color)]">
            <nav className="grid gap-2">
              {!hideServices ? (
                <Link
                  className="menu-item rounded-xl px-3 py-2 transition"
                  href="/services"
                >
                  Services
                </Link>
              ) : null}
              {!hideBooking ? (
                <Link
                  className="menu-item rounded-xl px-3 py-2 transition"
                  href="/book"
                >
                  Book now
                </Link>
              ) : null}
              {showAdmin ? (
                <Link
                  className="menu-item rounded-xl px-3 py-2 transition"
                  href="/admin/login"
                >
                  Admin
                </Link>
              ) : null}
              <div className="rounded-xl px-3 py-2">
                <ThemeToggle className="w-full justify-between" />
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
