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
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Retail Education That<br />Actually Drives Results
          </h1>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Practical, no-fluff courses built for retail operators ready to grow
            their business and improve their margins.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="#courses"
              className="bg-white text-brand-700 px-8 py-3 rounded-lg font-semibold hover:bg-brand-50 transition">
              Browse Courses
            </Link>
            {!user && (
              <Link href="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20 px-4 bg-gray-50 flex-1">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Available Courses
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {courses?.map((course) => (
              <div key={course.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <span className="text-white text-4xl">📚</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-600">
                      ${course.price_aud} AUD
                    </span>
                    <Link href={`/api/stripe/checkout?courseId=${course.id}`}
                      className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition">
                      Enrol Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {(!courses || courses.length === 0) && (
              <p className="text-gray-500 col-span-2 text-center py-12">Courses coming soon.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
