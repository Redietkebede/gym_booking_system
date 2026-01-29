# Atlas Forge — Gym Booking System

A Next.js App Router project for a boutique training studio. The public site is fully wired to Prisma data, and the admin area supports authentication plus booking/service management.

## Current Features

- **Marketing home page** with CTA links, dynamic services, and testimonials pulled from the database.
- **Services page** that lists active services from Prisma.
- **Booking page** connected to `POST /api/bookings` with validation and success states.
- **Theme toggle** (light/dark) using local storage.
- **Admin authentication** via NextAuth Credentials provider.
- **Admin bookings**: list, create, edit, and update booking status.
- **Admin services**: list, create, edit, toggle active status, and delete.
- **Prisma schema** for users, services (including `workoutIncludes` + `testimonials`), and bookings.
- **Seed script** to populate sample services and an admin user.

## Tech Stack

- **Next.js 16 (App Router)**
- **React 19**
- **Tailwind CSS v4**
- **Prisma + PostgreSQL** (supabase recommend)
- **NextAuth** (Credentials provider)

## Pages & Routes

### Public

- `/` — Home
- `/services` — Services listing
- `/book` — Booking form

### Admin

- `/admin/login` — Admin sign-in
- `/admin/bookings` — Booking management
- `/admin/bookings/new` — Create booking
- `/admin/bookings/[id]` — Edit booking
- `/admin/services` — Service management
- `/admin/services/new` — Create service
- `/admin/services/[id]` — Edit service

### API Routes

- `GET /api/services` — Active services
- `POST /api/bookings` — Create booking
- `GET/POST/PATCH/DELETE /api/admin/services` — Admin service management
- `GET/POST/PATCH/DELETE /api/admin/bookings` — Admin booking management
- `/api/auth/[...nextauth]` — NextAuth handler

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
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Setup

Run migrations and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Notes / Next Steps

- Add availability rules/time-slot management.
- Send confirmation emails or SMS for bookings.
- Add analytics/export for bookings.

## Scripts

- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Lint
