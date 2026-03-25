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

  if (course.external_url) redirect(course.external_url);

  return (
    <div className="min-h-screen flex flex-col bg-dark-base">
      <Header user={user} />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <a href="/dashboard" className="text-brand hover:text-brand-light text-sm transition">
              ← Dashboard
            </a>
            <span className="text-dark-card">|</span>
            <h1 className="font-heading text-xl">{course.title}</h1>
          </div>
          <div className="card-dark overflow-hidden">
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
