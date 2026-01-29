import AdminHeader from "../components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <AdminHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        {children}
      </main>
    </div>
  );
}
