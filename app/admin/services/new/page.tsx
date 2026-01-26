import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { NewServiceForm } from "../service-form";

export default async function NewServicePage() {
  const session = await requireAdmin();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="mt-6 rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
            Create new service
          </h1>
          <p className="mt-2 text-sm text-(--brand-ink)/70">
            Add a new session option for customers to book.
          </p>
        </div>
        <Link
          className="text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:text-(--brand-ember)"
          href="/admin/services"
        >
          Back to services
        </Link>
      </div>
      <NewServiceForm />
    </section>
  );
}
