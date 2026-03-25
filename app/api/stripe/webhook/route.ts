import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, enrolmentEmail } from "@/lib/emailit";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { user_id, course_id } = session.metadata ?? {};

    if (user_id && course_id) {
      const supabase = createServiceClient();

      const { error } = await supabase.from("enrolments").upsert(
        { user_id, course_id, stripe_session_id: session.id },
        { onConflict: "user_id,course_id" }
      );

      if (error) console.error("Enrolment upsert error:", error);

      // Send confirmation email
      const { data: course } = await supabase
        .from("courses").select("title").eq("id", course_id).single();

      if (session.customer_email && course) {
        await sendEmail({
          to: session.customer_email,
          subject: `You're enrolled: ${course.title}`,
          html: enrolmentEmail(course.title),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
