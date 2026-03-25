import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Header from "@/components/Header";

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses").select("*").eq("slug", params.slug).single();

  if (!course) notFound();

  const { data: enrolment } = await supabase
    .from("enrolments").select("id")
    .eq("user_id", user.id).eq("course_id", course.id).single();

  if (!enrolment) redirect(`/api/stripe/checkout?courseId=${course.id}`);

  // External URL — redirect student directly
  if (course.external_url) redirect(course.external_url);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <a href="/dashboard" className="text-brand-600 hover:underline text-sm">← Dashboard</a>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <iframe
              src={`/api/course/${params.slug}`}
              className="w-full min-h-[80vh] border-0"
              title={course.title}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
