import Link from "next/link";
import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function login(formData: FormData) {
    "use server";
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) redirect("/login?error=" + encodeURIComponent(error.message));
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-2xl tracking-wide">
            <span className="text-white">RETAIL</span>
            <span className="text-brand">BRICKS</span>
          </Link>
          <h1 className="font-heading text-2xl mt-6 mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to access your courses</p>
        </div>

        <div className="card-dark p-8">
          {searchParams.error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {decodeURIComponent(searchParams.error)}
            </div>
          )}
          <form action={login} className="space-y-5">
            <div>
              <label className="label-dark">Email</label>
              <input
                name="email" type="email" required autoComplete="email"
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <input
                name="password" type="password" required autoComplete="current-password"
                className="input-dark"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand text-dark-base py-2.5 rounded-lg font-semibold hover:bg-brand-light transition"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand hover:text-brand-light transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
