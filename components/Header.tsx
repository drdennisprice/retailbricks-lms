import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header({ user }: { user: any }) {
  let isAdmin = false;

  if (user) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }

  async function signOut() {
    "use server";
    const { createClient } = await import("@/lib/supabase/server");
    const { redirect } = await import("next/navigation");
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <header className="bg-dark-base/80 backdrop-blur-sm border-b border-dark-card sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-xl tracking-wide">
          <span className="text-white">RETAIL</span>
          <span className="text-brand">BRICKS</span>
        </Link>
        <nav className="flex items-center gap-5">
          {user ? (
            <>
              <Link href="#courses" className="text-sm text-slate-400 hover:text-white transition">
                Courses
              </Link>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition">
                My Learning
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm border border-brand/50 text-brand px-3 py-1 rounded-md hover:bg-brand/10 transition"
                >
                  Admin
                </Link>
              )}
              <form action={signOut}>
                <button type="submit" className="text-sm text-slate-400 hover:text-white transition">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="#courses" className="text-sm text-slate-400 hover:text-white transition">
                Courses
              </Link>
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-brand text-dark-base px-4 py-1.5 rounded-lg font-semibold hover:bg-brand-light transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
