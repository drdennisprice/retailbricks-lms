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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Courses</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add / Update Course</h2>
        <form action={saveCourse} encType="multipart/form-data" className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" required className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" required placeholder="visual-merchandising-for-profit"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price AUD</label>
            <input name="price" type="number" step="0.01" defaultValue="97"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">External URL (overrides ZIP)</label>
            <input name="external_url" type="url" placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload ZIP</label>
            <input name="zip" type="file" accept=".zip"
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <input name="published" type="checkbox" id="pub" defaultChecked className="w-4 h-4 accent-brand-600" />
            <label htmlFor="pub" className="text-sm font-medium text-gray-700">Published</label>
          </div>
          <div className="col-span-2">
            <button type="submit"
              className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition">
              Save Course
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              {["Title", "Slug", "Price", "Content", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {courses?.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">${c.price_aud}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {c.external_url ? "🔗 External" : c.content_path ? "📦 ZIP" : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
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
