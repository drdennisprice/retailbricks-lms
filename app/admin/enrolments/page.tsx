import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminEnrolmentsPage() {
  const supabase = createServiceClient();
  const { data: enrolments } = await supabase
    .from("enrolments")
    .select("*, profiles(email, full_name), courses(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Enrolments</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              {["User", "Course", "Stripe Session", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(enrolments as any[])?.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{e.profiles?.email}</div>
                  <div className="text-gray-400 text-xs">{e.profiles?.full_name}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{e.courses?.title}</td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                  {e.stripe_session_id?.slice(0, 24)}…
                </td>
                <td className="px-4 py-3 text-gray-500">
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
