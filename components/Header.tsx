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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-brand-700 hover:text-brand-800 transition">
          RetailBricks Learn
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-brand-600 transition">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin"
                  className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium hover:bg-purple-200 transition">
                  Admin
                </Link>
              )}
              <form action={signOut}>
                <button type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 transition">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-brand-600 transition">
                Sign In
              </Link>
              <Link href="/signup"
                className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-brand-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
