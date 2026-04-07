import { redirect } from "next/navigation";

import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type ServiceTableRow = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
};

export default async function AdminServicesPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect("/admin/login");
  }

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="mt-6 rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
            Services
          </h1>
          <p className="mt-2 text-sm text-(--brand-ink)/70">
            Review and edit your services.
          </p>
        </div>
        <Link
          className="w-fit rounded-full border border-(--brand-ink) px-5 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember)"
          href="/admin/services/new"
        >
          Create new service
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-(--border-subtle)">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-(--surface-solid) text-xs uppercase tracking-widest text-(--brand-ink)/60">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.length ? (
              services.map((service: ServiceTableRow) => (
                <tr
                  key={service.id}
                  className="border-t border-(--border-subtle) text-(--brand-ink)"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold">{service.name}</div>
                    {service.description ? (
                      <div className="text-xs text-(--brand-ink)/60">
                        {service.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {service.durationMinutes} min
                  </td>
                  <td className="px-4 py-4 text-sm">
                    USD {service.price.toLocaleString("en-KE")}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                        service.isActive
                          ? "bg-(--pill-bg) text-(--brand-ink)"
                          : "bg-(--brand-ink)/10 text-(--brand-ink)/70"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      className="rounded-full border border-(--border-subtle) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:border-(--brand-ember) hover:text-(--brand-ember)"
                      href={`/admin/services/${service.id}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-(--brand-ink)/60">
                  No services yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
