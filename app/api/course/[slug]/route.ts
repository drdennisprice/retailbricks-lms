import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const sb = createServiceClient();
  const { data: course } = await sb.from("courses").select("*").eq("slug", params.slug).single();
  if (!course) return new NextResponse("Not Found", { status: 404 });

  const { data: enrolment } = await sb
    .from("enrolments").select("id")
    .eq("user_id", user.id).eq("course_id", course.id).single();

  if (!enrolment) return new NextResponse("Forbidden", { status: 403 });

  if (!course.content_path) {
    return new NextResponse(
      "<html><body style='font-family:sans-serif;padding:40px'><h1>Course content coming soon.</h1></body></html>",
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const { data } = await sb.storage.from("courses").download(course.content_path);
  if (!data) return new NextResponse("Content not found", { status: 404 });

  const arrayBuffer = await data.arrayBuffer();
  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${params.slug}.zip"`,
    },
  });
}
