import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function DashboardPage({ searchParams }: { searchParams: { enrolled?: string } }) {
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-500 mb-10">Welcome back, {user.email}</p>

        {searchParams.enrolled && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            🎉 Enrolment confirmed! Your course is ready below.
          </div>
        )}

        {enrolled.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {enrolled.map((course: any) => (
                <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                      <span className="text-white text-3xl">📚</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-3">{course.title}</h3>
                    <Link href={`/courses/${course.slug}`}
                      className="inline-block bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition">
                      Continue Learning →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {unenrolled.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {unenrolled.map((course) => (
                <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-3xl">🔒</span>
                    </div>
                  )}
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{course.title}</h3>
                      <p className="text-brand-600 font-semibold text-sm mt-1">${course.price_aud} AUD</p>
                    </div>
                    <Link href={`/api/stripe/checkout?courseId=${course.id}`}
                      className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition">
                      Enrol
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {enrolled.length === 0 && unenrolled.length === 0 && (
          <p className="text-gray-500 text-center py-12">No courses available yet. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
