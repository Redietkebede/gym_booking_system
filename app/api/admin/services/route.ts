import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type ServicePayload = {
  id?: string;
  name?: string;
  description?: string | null;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
  workoutIncludes?: string[];
  testimonials?: unknown;
};

type ServiceUpdateArg = Parameters<typeof prisma.service.update>[0];
type SafeServiceUpdateData = ServiceUpdateArg extends { data: infer TData }
  ? TData
  : Record<string, unknown>;

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ServicePayload;

  try {
    payload = (await request.json()) as ServicePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const {
    name,
    description,
    durationMinutes,
    price,
    isActive,
    workoutIncludes,
    testimonials,
  } = payload;

  if (!name || !durationMinutes || !price) {
    return NextResponse.json(
      { error: "name, durationMinutes, and price are required." },
      { status: 400 },
    );
  }

  const service = await prisma.service.create({
    data: {
      name,
      description: description ?? null,
      durationMinutes,
      price,
      isActive: isActive ?? true,
      workoutIncludes: workoutIncludes ?? [],
      testimonials: testimonials ?? [],
    },
  });

  return NextResponse.json(service);
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ServicePayload;

  try {
    payload = (await request.json()) as ServicePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.id) {
    return NextResponse.json({ error: "Service id is required." }, { status: 400 });
  }

  const {
    id,
    name,
    description,
    durationMinutes,
    price,
    isActive,
    workoutIncludes,
    testimonials,
  } = payload;

  const normalizedTestimonials =
    testimonials === undefined
      ? undefined
      : testimonials === null
        ? null
        : testimonials;

  const service = await prisma.service.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(durationMinutes ? { durationMinutes } : {}),
      ...(price ? { price } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(workoutIncludes ? { workoutIncludes } : {}),
      ...(normalizedTestimonials !== undefined
        ? { testimonials: normalizedTestimonials }
        : {}),
    } as SafeServiceUpdateData,
  });

  return NextResponse.json(service);
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { id?: string };

  try {
    payload = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.id) {
    return NextResponse.json({ error: "Service id is required." }, { status: 400 });
  }

  await prisma.service.delete({ where: { id: payload.id } });

  return NextResponse.json({ success: true });
}
