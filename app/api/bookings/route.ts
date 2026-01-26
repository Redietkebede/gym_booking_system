import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type BookingPayload = {
  serviceId?: string;
  date?: string;
  timeSlot?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

export async function POST(request: Request) {
  let payload: BookingPayload;

  try {
    payload = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const {
    serviceId,
    date,
    timeSlot,
    customerName,
    customerEmail,
    customerPhone,
  } = payload;

  if (
    !serviceId ||
    !date ||
    !timeSlot ||
    !customerName ||
    !customerEmail ||
    !customerPhone
  ) {
    return NextResponse.json(
      { success: false, error: "All booking fields are required." },
      { status: 400 },
    );
  }

  const bookingDate = new Date(date);
  if (Number.isNaN(bookingDate.getTime())) {
    return NextResponse.json(
      { success: false, error: "Invalid booking date." },
      { status: 400 },
    );
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, isActive: true },
    select: { id: true },
  });

  if (!service) {
    return NextResponse.json(
      { success: false, error: "Service not found or inactive." },
      { status: 404 },
    );
  }

  const booking = await prisma.booking.create({
    data: {
      serviceId,
      date: bookingDate,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
    },
    select: { id: true },
  });

  return NextResponse.json({ success: true, bookingId: booking.id });
}
