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
    { label: "Total Users", value: userCount ?? 0 },
    { label: "Courses", value: courseCount ?? 0 },
    { label: "Enrolments", value: enrolmentCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl mb-8">Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="card-dark p-6">
            <p className="text-sm text-slate-400 mb-1">{s.label}</p>
            <p className="font-heading text-4xl text-brand">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
