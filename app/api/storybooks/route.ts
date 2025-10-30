import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateSlug } from "@/utils/slug";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Query only admin-published storybooks (is_admin = 1)
  // No need to check login status, just show all admin-published books
  // Include slug if column exists (will work after migration)
  const { data, error } = await supabase
    .from("storybooks")
    .select("id,title,description,icon,featured,bookcontent,data,slug")
    .eq("is_admin", 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[API] Storybooks query error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.log("[API] Storybooks query result:", { count: data?.length || 0 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { storybook, guestToken, meta } = body as { storybook: any; guestToken?: string; meta?: any };
  if (!storybook) return NextResponse.json({ error: "missing storybook" }, { status: 400 });
  console.log("[DB][Step 6] Start: Insert storybook to DB", {
    title: meta?.title ?? storybook?.title,
    hasImages: Array.isArray(storybook?.images) && storybook.images.length > 0,
  });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Generate slug from title (only if slug column exists)
  const title = meta?.title ?? storybook.title ?? "Untitled";
  let slug = meta?.slug || generateSlug(title);
  
  // Try to ensure slug is unique (only if slug column exists)
  if (slug) {
    try {
      const { data: existing } = await supabase
        .from("storybooks")
        .select("slug")
        .eq("slug", slug)
        .limit(1);
      
      if (existing && existing.length > 0) {
        // If slug exists, append timestamp to make it unique
        slug = `${slug}-${Date.now()}`;
      }
    } catch {
      // Slug column doesn't exist yet, skip slug uniqueness check
      slug = null;
    }
  }

  const insert: any = {
    title,
    description: meta?.description ?? storybook.summary ?? "",
    icon: meta?.icon ?? "📖",
    featured: !!meta?.featured,
    bookcontent: meta?.bookcontent ?? null,
    data: storybook,
    guest_token: user ? null : guestToken ?? null,
    user_id: user ? user.id : null,
    is_admin: meta?.is_admin !== undefined ? (meta.is_admin ? 1 : 0) : 0,
  };
  
  // Only include slug if column exists (will work after migration)
  if (slug) {
    insert.slug = slug;
  }

  const { data, error } = await supabase.from("storybooks").insert(insert).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  console.log("[DB][Step 6] Done: Inserted storybook id:", data?.id);
  return NextResponse.json({ id: data?.id });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { guestToken } = body as { guestToken?: string };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !guestToken) return NextResponse.json({ ok: true });
  const { error } = await supabase
    .from("storybooks")
    .update({ user_id: user.id })
    .is("guest_token", guestToken)
    .select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}


