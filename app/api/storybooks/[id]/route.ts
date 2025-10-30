import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(_req: Request, context: { params: { id: string } }) {
  const identifier = decodeURIComponent(context.params.id); // Can be slug or id

  try {
    const supabase = await createClient();

    // Try to find by slug first, then by id
    // Only show admin-published books (is_admin = 1)
    let query = supabase
      .from("storybooks")
      .select("id,title,description,icon,featured,bookcontent,data,is_admin,slug")
      .eq("is_admin", 1)
      .or(`slug.eq.${identifier},id.eq.${identifier}`);

    const { data, error } = await query.single();
    
    if (error || !data || data.is_admin !== 1) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      featured: data.featured,
      bookcontent: data.bookcontent || null,
      data: data.data || null,
      slug: data.slug || null,
    });
  } catch (error) {
    return new NextResponse("Not found", { status: 404 });
  }
}


