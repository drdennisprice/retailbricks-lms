import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get("courseId");
  if (!courseId) return NextResponse.redirect(new URL("/", request.url));

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login?next=/", request.url));

  const { data: course } = await supabase
    .from("courses").select("*").eq("id", courseId).eq("published", true).single();

  if (!course) return NextResponse.redirect(new URL("/", request.url));

  // Already enrolled?
  const { data: existing } = await supabase
    .from("enrolments").select("id")
    .eq("user_id", user.id).eq("course_id", courseId).single();

  if (existing) return NextResponse.redirect(new URL(`/courses/${course.slug}`, request.url));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learn.retailbricks.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency: "aud",
        unit_amount: Math.round(course.price_aud * 100),
        product_data: {
          name: course.title,
          description: course.description ?? undefined,
        },
      },
      quantity: 1,
    }],
    metadata: { user_id: user.id, course_id: courseId, app: 'retailbricks-lms', product: 'lms_course' },
    success_url: `${siteUrl}/dashboard?enrolled=1`,
    cancel_url: `${siteUrl}/`,
  });

  return NextResponse.redirect(session.url!);
}
