DO $$
BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Service" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "durationMinutes" INTEGER NOT NULL,
  "price" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "workoutIncludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "testimonials" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "serviceId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Booking_serviceId_idx" ON "Booking"("serviceId");

DO $$
BEGIN
  IF to_regclass('"User_rows"') IS NOT NULL THEN
    INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
    SELECT
      ur."id",
      COALESCE(ur."name", 'Admin'),
      ur."email",
      ur."passwordHash",
      COALESCE(ur."role", 'ADMIN'),
      COALESCE(ur."createdAt", NOW())::timestamp(3),
      COALESCE(ur."updatedAt", NOW())::timestamp(3)
    FROM "User_rows" ur
    WHERE ur."id" IS NOT NULL
      AND ur."email" IS NOT NULL
      AND ur."passwordHash" IS NOT NULL
    ON CONFLICT ("email") DO NOTHING;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('"Service_rows"') IS NOT NULL THEN
    INSERT INTO "Service" (
      "id", "name", "description", "durationMinutes", "price", "isActive",
      "workoutIncludes", "testimonials", "createdAt", "updatedAt"
    )
    SELECT
      sr."id",
      COALESCE(sr."name", 'Untitled Service'),
      sr."description",
      COALESCE(sr."durationMinutes", 60)::integer,
      COALESCE(sr."price", 0)::integer,
      COALESCE(sr."isActive", true),
      CASE
        WHEN sr."workoutIncludes" IS NULL THEN ARRAY[]::TEXT[]
        WHEN jsonb_typeof(sr."workoutIncludes") = 'array' THEN ARRAY(
          SELECT jsonb_array_elements_text(sr."workoutIncludes")
        )
        ELSE ARRAY[]::TEXT[]
      END,
      CASE
        WHEN sr."testimonials" IS NULL OR btrim(sr."testimonials") = '' THEN '[]'::jsonb
        WHEN sr."testimonials" ~ '^\s*[\[{]' THEN sr."testimonials"::jsonb
        ELSE '[]'::jsonb
      END,
      COALESCE(sr."createdAt", NOW())::timestamp(3),
      COALESCE(sr."updatedAt", NOW())::timestamp(3)
    FROM "Service_rows" sr
    WHERE sr."id" IS NOT NULL
    ON CONFLICT ("id") DO NOTHING;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('"Booking_rows"') IS NOT NULL THEN
    INSERT INTO "Booking" (
      "id", "customerName", "customerEmail", "customerPhone", "date",
      "timeSlot", "status", "serviceId", "createdAt", "updatedAt"
    )
    SELECT
      br."id",
      COALESCE(br."customerName", 'Guest'),
      COALESCE(br."customerEmail", 'unknown@example.com'),
      COALESCE(br."customerPhone", 'N/A'),
      COALESCE(br."date", NOW())::timestamp(3),
      COALESCE(br."timeSlot", 'TBD'),
      CASE UPPER(COALESCE(br."status", 'PENDING'))
        WHEN 'APPROVED' THEN 'APPROVED'::"BookingStatus"
        WHEN 'REJECTED' THEN 'REJECTED'::"BookingStatus"
        WHEN 'COMPLETED' THEN 'COMPLETED'::"BookingStatus"
        ELSE 'PENDING'::"BookingStatus"
      END,
      br."serviceId",
      COALESCE(br."createdAt", NOW())::timestamp(3),
      COALESCE(br."updatedAt", NOW())::timestamp(3)
    FROM "Booking_rows" br
    WHERE br."id" IS NOT NULL
      AND br."serviceId" IS NOT NULL
      AND EXISTS (SELECT 1 FROM "Service" s WHERE s."id" = br."serviceId")
    ON CONFLICT ("id") DO NOTHING;
  END IF;
END
$$;
