import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminEnrolmentsPage() {
  const supabase = createServiceClient();
  const { data: enrolments } = await supabase
    .from("enrolments")
    .select("*, profiles(email, full_name), courses(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl mb-8">Enrolments</h1>
      <div className="card-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-card border-b border-dark-card text-slate-400">
            <tr>
              {["User", "Course", "Stripe Session", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-card">
            {(enrolments as any[])?.map((e) => (
              <tr key={e.id} className="hover:bg-dark-card/50 transition">
                <td className="px-4 py-3">
                  <div className="text-white">{e.profiles?.email}</div>
                  <div className="text-slate-400 text-xs">{e.profiles?.full_name}</div>
                </td>
                <td className="px-4 py-3 text-slate-300">{e.courses?.title}</td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                  {e.stripe_session_id?.slice(0, 24)}…
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(e.created_at).toLocaleDateString("en-AU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
