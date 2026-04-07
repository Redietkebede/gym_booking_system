# Gym Booking System

A Next.js App Router project for a premium training studio. The site is fully wired to Prisma data, and the admin area supports authentication plus booking/service management.

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

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in your real DB credentials and auth secret.

Required variables:

```bash
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="admin123"
SEED_ADMIN_NAME="Admin"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Optional (login hint button, recommended for local/dev only):

```bash
NEXT_PUBLIC_SEED_ADMIN_EMAIL="admin@example.com"
NEXT_PUBLIC_SEED_ADMIN_PASSWORD="admin123"
```

## Database Setup

### Fresh database (recommended for new environments)

```bash
npx prisma migrate deploy
npx prisma db seed
```

### Existing Supabase database with `*_rows` tables/data

If your DB already contains `User_rows`, `Service_rows`, `Booking_rows`, run:

```bash
npx prisma db execute --schema prisma/schema.prisma --file prisma/sql/sync_existing_rows.sql
```

This creates the app tables (`User`, `Service`, `Booking`) and copies data without dropping the existing `*_rows` tables.

After either path:

```bash
npx prisma generate
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
