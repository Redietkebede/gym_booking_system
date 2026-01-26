# Atlas Forge — Gym Booking System

A Next.js App Router project for a boutique training studio. The current UI includes a branded marketing home page, a services listing, and a booking form UI. The data layer is defined with Prisma and PostgreSQL, with seed data for services and an admin user.

## Current Features

- **Marketing home page** with CTA links to services and booking.
- **Services page** with curated session cards.
- **Booking page** UI with form fields (UI-only for now).
- **Theme toggle** (light/dark) using local storage.
- **Prisma schema** for users, services, and bookings.
- **Seed script** to populate sample services and an admin user.

## Tech Stack

- **Next.js 16 (App Router)**
- **React 19**
- **Tailwind CSS v4**
- **Prisma + PostgreSQL**
- **NextAuth** (installed, not wired yet)

## Pages & Routes

- `/` — Home
- `/services` — Services listing
- `/book` — Booking form UI

## Data Model (Prisma)

- **User** (admin seeded)
- **Service**
- **Booking** (with status enum)

See the schema in `prisma/schema.prisma`.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Create `.env` with:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="admin123"
SEED_ADMIN_NAME="Admin"
```

## Database Setup

Run migrations and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Notes / Next Steps

- Hook the booking form to an API route.
- Add authentication for admin access.
- Build admin dashboard for bookings and services.
- Replace hardcoded services UI with database data.

## Scripts

- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Lint
