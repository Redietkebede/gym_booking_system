-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "testimonials" JSONB,
ADD COLUMN     "workoutIncludes" TEXT[] DEFAULT ARRAY[]::TEXT[];
