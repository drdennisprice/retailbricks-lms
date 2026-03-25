import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-brand-800 text-white px-6 py-3 flex items-center gap-6 text-sm">
        <span className="font-bold text-base">Admin</span>
        <Link href="/admin" className="hover:text-brand-200">Overview</Link>
        <Link href="/admin/courses" className="hover:text-brand-200">Courses</Link>
        <Link href="/admin/users" className="hover:text-brand-200">Users</Link>
        <Link href="/admin/enrolments" className="hover:text-brand-200">Enrolments</Link>
        <Link href="/dashboard" className="ml-auto hover:text-brand-200">← Site</Link>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
