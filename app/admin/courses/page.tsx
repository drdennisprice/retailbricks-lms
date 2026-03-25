import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminCoursesPage() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from("courses").select("*").order("created_at", { ascending: false });

  async function saveCourse(formData: FormData) {
    "use server";
    const { createServiceClient } = await import("@/lib/supabase/server");
    const { revalidatePath } = await import("next/cache");
    const sb = createServiceClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const externalUrl = (formData.get("external_url") as string) || null;
    const published = formData.get("published") === "on";
    const file = formData.get("zip") as File;

    let content_path: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const { error: uploadError } = await sb.storage
        .from("courses")
        .upload(`${slug}/course.zip`, Buffer.from(bytes), { upsert: true, contentType: "application/zip" });
      if (!uploadError) content_path = `${slug}/course.zip`;
    }

    await sb.from("courses").upsert({
      title, slug, description,
      price_aud: price,
      external_url: externalUrl,
      content_path,
      published,
    }, { onConflict: "slug" });

    revalidatePath("/admin/courses");
  }

  return (
    <div>
      <h1 className="font-heading text-2xl mb-8">Courses</h1>

      {/* Add / Edit form */}
      <div className="card-dark p-6 mb-8">
        <h2 className="font-heading text-lg mb-5">Add / Update Course</h2>
        <form action={saveCourse} encType="multipart/form-data" className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-dark">Title</label>
            <input name="title" required className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Slug</label>
            <input name="slug" required placeholder="visual-merchandising-for-profit" className="input-dark" />
          </div>
          <div className="col-span-2">
            <label className="label-dark">Description</label>
            <textarea name="description" rows={2} className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Price AUD</label>
            <input name="price" type="number" step="0.01" defaultValue="97" className="input-dark" />
          </div>
          <div>
            <label className="label-dark">External URL (overrides ZIP)</label>
            <input name="external_url" type="url" placeholder="https://..." className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Upload ZIP</label>
            <input
              name="zip" type="file" accept=".zip"
              className="w-full text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-dark-card file:text-slate-300 file:cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <input name="published" type="checkbox" id="pub" defaultChecked className="w-4 h-4 accent-brand" />
            <label htmlFor="pub" className="text-sm text-slate-300">Published</label>
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn-primary">
              Save Course
            </button>
          </div>
        </form>
      </div>

      {/* Course table */}
      <div className="card-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-card border-b border-dark-card text-slate-400">
            <tr>
              {["Title", "Slug", "Price", "Content", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-card">
            {courses?.map((c) => (
              <tr key={c.id} className="hover:bg-dark-card/50 transition">
                <td className="px-4 py-3 font-medium text-white">{c.title}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-brand">${c.price_aud}</td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {c.external_url ? "↗ External" : c.content_path ? "📦 ZIP" : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.published
                      ? "bg-brand/15 text-brand"
                      : "bg-dark-card text-slate-500"
                  }`}>
                    {c.published ? "Live" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
