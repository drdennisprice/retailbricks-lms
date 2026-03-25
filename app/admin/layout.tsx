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
    <div className="min-h-screen bg-dark-base">
      <nav className="bg-dark-mid border-b border-dark-card px-6 py-3 flex items-center gap-6 text-sm">
        <span className="font-heading text-white text-base">
          RETAIL<span className="text-brand">BRICKS</span>
          <span className="text-slate-500 ml-2 text-xs font-sans">Admin</span>
        </span>
        <Link href="/admin" className="text-slate-400 hover:text-white transition">Overview</Link>
        <Link href="/admin/courses" className="text-slate-400 hover:text-white transition">Courses</Link>
        <Link href="/admin/users" className="text-slate-400 hover:text-white transition">Users</Link>
        <Link href="/admin/enrolments" className="text-slate-400 hover:text-white transition">Enrolments</Link>
        <Link href="/dashboard" className="ml-auto text-slate-400 hover:text-white transition">← Site</Link>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
