import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = createServiceClient();
  const { data: users } = await supabase
    .from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl mb-8">Users</h1>
      <div className="card-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-card border-b border-dark-card text-slate-400">
            <tr>
              {["Email", "Name", "Role", "Joined"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-card">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-dark-card/50 transition">
                <td className="px-4 py-3 text-white">{u.email}</td>
                <td className="px-4 py-3 text-slate-400">{u.full_name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-accent/15 text-accent"
                      : "bg-dark-card text-slate-400"
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(u.created_at).toLocaleDateString("en-AU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
