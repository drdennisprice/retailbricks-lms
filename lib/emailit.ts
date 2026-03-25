interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const res = await fetch("https://api.emailit.com/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EMAILIT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.EMAILIT_FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) console.error("EmailIt error:", await res.text());
  return res.ok;
}

export function enrolmentEmail(courseName: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#0369a1">Welcome to ${courseName}!</h1>
      <p>Your enrolment is confirmed. Access your course from the dashboard anytime.</p>
      <a href="https://learn.retailbricks.com/dashboard"
         style="display:inline-block;padding:12px 24px;background:#0369a1;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0">
        Go to Dashboard
      </a>
      <p style="color:#666;margin-top:24px">Questions? Reply to this email — we read everything.</p>
    </div>
  `;
}
