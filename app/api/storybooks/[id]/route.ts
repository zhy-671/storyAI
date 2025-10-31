import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  // Derive id from URL to avoid typing the route context
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const rawId = decodeURIComponent(segments[segments.length - 1] || "");
  const identifier = decodeURIComponent(rawId); // Can be slug or id
  
  // Generate potential slug variations
  const slugVariations = [
    identifier, // Original (decoded)
    identifier.toLowerCase(), // Lowercase
    identifier.toLowerCase().replace(/\s+/g, "-"), // With hyphens
    identifier.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), // Clean slug
    rawId, // Raw input
  ].filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates

  console.log("[API] Storybook detail request:", { rawId, identifier, slugVariations });

  try {
    const supabase = await createClient();

    // Try to find by slug (try all variations)
    let data = null;
    let error = null;
    
    for (const slug of slugVariations) {
      const query = supabase
        .from("storybooks")
        .select("id,title,description,icon,featured,bookcontent,data,is_admin,slug")
        .eq("is_admin", 1)
        .eq("slug", slug);

      const result = await query.single();
      
      if (!result.error && result.data) {
        data = result.data;
        error = null;
        console.log("[API] Found by slug:", slug);
        break;
      }
      
      // Also try by id if it looks like a UUID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        const idQuery = supabase
          .from("storybooks")
          .select("id,title,description,icon,featured,bookcontent,data,is_admin,slug")
          .eq("is_admin", 1)
          .eq("id", slug);
        
        const idResult = await idQuery.single();
        if (!idResult.error && idResult.data) {
          data = idResult.data;
          error = null;
          console.log("[API] Found by id:", slug);
          break;
        }
      }
    }
    
    if (error || !data || data.is_admin !== 1) {
      console.error("[API] Storybook not found:", { error, hasData: !!data, identifier, slugVariations });
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


