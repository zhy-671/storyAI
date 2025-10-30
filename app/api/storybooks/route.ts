import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guestToken = searchParams.get("guestToken");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const query = supabase
    .from("storybooks")
    .select("id,title,description,icon,featured,bookcontent")
    .order("created_at", { ascending: false });

  if (user) {
    query.or(`user_id.eq.${user.id}${guestToken ? ",guest_token.eq." + guestToken : ""}`);
  } else if (guestToken) {
    query.eq("guest_token", guestToken);
  } else {
    // public showcase fallback (no user, no token) → return demo items
    return NextResponse.json([
      { id: "cat", title: "Sunny Kitten", description: "A warm bedtime picture book about a smiling kitten", icon: "🐱", featured: true, bookcontent: "/samples/storybook_sample_cat.json" },
      { id: "sample", title: "Star Lamp in the Ruins", description: "A healing story about light and courage", icon: "⭐", featured: true, bookcontent: "/samples/storybook_sample.json" },
    ]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
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

  const insert = {
    title: meta?.title ?? storybook.title ?? "Untitled",
    description: meta?.description ?? storybook.summary ?? "",
    icon: meta?.icon ?? "📖",
    featured: !!meta?.featured,
    bookcontent: meta?.bookcontent ?? null,
    data: storybook,
    guest_token: user ? null : guestToken ?? null,
    user_id: user ? user.id : null,
  } as any;

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


