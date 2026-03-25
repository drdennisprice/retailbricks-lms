import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { enrolled?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: enrolments } = await supabase
    .from("enrolments")
    .select("course_id, courses(id, title, slug, description, thumbnail_url)")
    .eq("user_id", user.id);

  const enrolled = (enrolments?.map((e: any) => e.courses) ?? []).filter(Boolean);
  const enrolledIds = new Set(enrolled.map((c: any) => c?.id));

  const { data: allCourses } = await supabase
    .from("courses")
    .select("id, title, slug, description, price_aud, thumbnail_url")
    .eq("published", true);

  const unenrolled = allCourses?.filter((c) => !enrolledIds.has(c.id)) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-dark-base">
      <Header user={user} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">

        {/* Page title */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl mb-1">My Learning</h1>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>

        {/* Enrolment success */}
        {searchParams.enrolled && (
          <div className="mb-8 p-4 bg-brand/10 border border-brand/30 rounded-xl text-brand">
            🎉 Enrolment confirmed! Your course is ready below.
          </div>
        )}

        {/* Enrolled courses */}
        {enrolled.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading text-xl mb-5">My Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {enrolled.map((course: any) => (
                <div key={course.id} className="card-dark flex flex-col hover:border-brand/40 transition">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-dark-card flex items-center justify-center">
                      <svg className="w-10 h-10 text-brand/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading text-base mb-3">{course.title}</h3>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-block bg-brand text-dark-base px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-light transition"
                    >
                      Continue Learning →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unenrolled courses */}
        {unenrolled.length > 0 && (
          <section>
            <h2 className="font-heading text-xl mb-5">Available Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {unenrolled.map((course) => (
                <div key={course.id} className="card-dark hover:border-brand/40 transition">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-dark-card flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-base">{course.title}</h3>
                      <p className="text-brand text-sm mt-1">${course.price_aud} AUD</p>
                    </div>
                    <Link
                      href={`/api/stripe/checkout?courseId=${course.id}`}
                      className="bg-brand text-dark-base px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-light transition"
                    >
                      Enrol
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enrolled.length === 0 && unenrolled.length === 0 && (
          <p className="text-slate-500 text-center py-16">No courses available yet. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
