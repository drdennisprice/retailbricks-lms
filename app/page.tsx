import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, description, price_aud, thumbnail_url")
    .eq("published", true)
    .order("created_at");

  return (
    <div className="min-h-screen flex flex-col bg-dark-base">
      <Header user={user} />

      {/* Hero */}
      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 border border-brand/40 text-brand text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
            Professional Learning Platform
          </div>

          <h1 className="font-heading text-5xl md:text-6xl leading-tight mb-6">
            Learn the skills that{" "}
            <span className="text-brand">move the needle</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Practical courses built by practitioners. No theory overload — just
            frameworks you can apply from day one.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="#courses" className="btn-primary">
              Browse Courses
            </Link>
            {!user && (
              <Link href="/signup" className="btn-outline">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20 px-4 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl mb-3">
              Available Courses
            </h2>
            <p className="text-slate-400 text-sm tracking-wide">
              Each course is self-paced, lifetime access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {courses?.map((course) => (
              <div key={course.id} className="card-dark flex flex-col hover:border-brand/40 transition-all duration-200">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-dark-card flex items-center justify-center">
                    {/* Book icon */}
                    <svg className="w-12 h-12 text-brand/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-lg mb-2">{course.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand font-heading text-2xl">
                      ${course.price_aud}
                      <span className="text-slate-500 text-sm font-sans ml-1">AUD</span>
                    </span>
                    <Link
                      href={user ? `/api/stripe/checkout?courseId=${course.id}` : "/signup"}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Enrol Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {(!courses || courses.length === 0) && (
              <p className="text-slate-500 col-span-2 text-center py-16">
                Courses coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
