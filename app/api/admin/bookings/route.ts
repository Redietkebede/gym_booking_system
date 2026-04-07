import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const BOOKING_STATUS_VALUES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

type BookingStatus = (typeof BOOKING_STATUS_VALUES)[number];

function toBookingStatus(value?: string | null): BookingStatus | undefined {
  if (!value) {
    return undefined;
  }
  return BOOKING_STATUS_VALUES.includes(value as BookingStatus)
    ? (value as BookingStatus)
    : undefined;
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status") ?? undefined;
  const date = url.searchParams.get("date") ?? undefined;
  const status = toBookingStatus(statusParam);

  const dateFilter =
    date && !Number.isNaN(new Date(date).getTime())
      ? {
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
        }
      : undefined;

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(dateFilter ?? {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      date: true,
      timeSlot: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: {
    serviceId?: string;
    date?: string;
    timeSlot?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    status?: string;
  };

  try {
    payload = (await request.json()) as {
      serviceId?: string;
      date?: string;
      timeSlot?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      status?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { serviceId, date, timeSlot, customerName, customerEmail, customerPhone } =
    payload;

  if (!serviceId || !date || !timeSlot || !customerName || !customerEmail || !customerPhone) {
    return NextResponse.json(
      { error: "All booking fields are required." },
      { status: 400 },
    );
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      serviceId,
      date: parsedDate,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
      status: "PENDING",
    },
  });

  return NextResponse.json(booking);
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: {
    bookingId?: string;
    newStatus?: string;
    status?: string;
    serviceId?: string;
    date?: string;
    timeSlot?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  };

  try {
    payload = (await request.json()) as {
      bookingId?: string;
      newStatus?: string;
      status?: string;
      serviceId?: string;
      date?: string;
      timeSlot?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.bookingId) {
    return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
  }

  const statusValue = payload.newStatus ?? payload.status;
  const bookingStatus = toBookingStatus(statusValue);
  if (statusValue && !bookingStatus) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  let parsedDate: Date | undefined;
  if (payload.date) {
    parsedDate = new Date(`${payload.date}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }
  }

  if (payload.serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: payload.serviceId },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }
  }

  const updated = await prisma.booking.update({
    where: { id: payload.bookingId },
    data: {
      ...(bookingStatus
        ? { status: bookingStatus }
        : {}),
      ...(payload.serviceId ? { serviceId: payload.serviceId } : {}),
      ...(parsedDate ? { date: parsedDate } : {}),
      ...(payload.timeSlot ? { timeSlot: payload.timeSlot } : {}),
      ...(payload.customerName ? { customerName: payload.customerName } : {}),
      ...(payload.customerEmail ? { customerEmail: payload.customerEmail } : {}),
      ...(payload.customerPhone ? { customerPhone: payload.customerPhone } : {}),
    },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { bookingId?: string };

  try {
    payload = (await request.json()) as { bookingId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.bookingId) {
    return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
  }

  await prisma.booking.delete({ where: { id: payload.bookingId } });

  return NextResponse.json({ success: true });
}
