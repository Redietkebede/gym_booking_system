import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { EditServiceForm } from "../service-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: PageProps) {
  const session = await requireAdmin();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (!id) {
    notFound();
  }

  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      durationMinutes: true,
      price: true,
      isActive: true,
      workoutIncludes: true,
      testimonials: true,
    },
  });

  if (!service) {
    redirect("/admin/services");
  }

  return (
    <section className="mt-6 rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
            Edit service
          </h1>
          <p className="mt-2 text-sm text-(--brand-ink)/70">
            Update details, availability, or delete the service.
          </p>
        </div>
        <Link
          className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:text-(--brand-ember)"
          href="/admin/services"
        >
          Back to services
        </Link>
      </div>
      <EditServiceForm initialService={service} />
    </section>
  );
}
