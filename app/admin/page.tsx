import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const [
    { count: userCount },
    { count: courseCount },
    { count: enrolmentCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("enrolments").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount ?? 0, icon: "👤" },
    { label: "Courses", value: courseCount ?? 0, icon: "📚" },
    { label: "Enrolments", value: enrolmentCount ?? 0, icon: "✅" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-brand-600 mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
