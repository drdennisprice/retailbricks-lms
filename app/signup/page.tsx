import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  async function signup(formData: FormData) {
    "use server";
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: { full_name: formData.get("name") as string },
      },
    });
    if (error) redirect("/signup?error=" + encodeURIComponent(error.message));
    redirect("/dashboard");
  }

  if (searchParams.success) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
        <div className="max-w-md w-full card-dark p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl mb-2">Account created!</h1>
          <p className="text-slate-400 mb-8">Check your email to verify your address, then sign in.</p>
          <Link href="/login" className="btn-primary inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-2xl tracking-wide">
            <span className="text-white">RETAIL</span>
            <span className="text-brand">BRICKS</span>
          </Link>
          <h1 className="font-heading text-2xl mt-6 mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm">Free to join. Pay only for courses you want.</p>
        </div>

        <div className="card-dark p-8">
          {searchParams.error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {decodeURIComponent(searchParams.error)}
            </div>
          )}
          <form action={signup} className="space-y-5">
            <div>
              <label className="label-dark">Full Name</label>
              <input name="name" type="text" required className="input-dark" placeholder="Your name" />
            </div>
            <div>
              <label className="label-dark">Email</label>
              <input name="email" type="email" required className="input-dark" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <input
                name="password" type="password" required minLength={6}
                className="input-dark" placeholder="Min. 6 characters"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand text-dark-base py-2.5 rounded-lg font-semibold hover:bg-brand-light transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand hover:text-brand-light transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
