import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const CREEM_API_URL = process.env.CREEM_API_URL!;
const CREEM_API_KEY = process.env.CREEM_API_KEY!;
const CREEM_SUCCESS_URL = process.env.CREEM_SUCCESS_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000/dashboard";

type Body = {
  productId: string;
  credits: number;
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!CREEM_API_URL || !CREEM_API_KEY) {
      return NextResponse.json({ error: "Creem not configured" }, { status: 500 });
    }

    const { productId, credits } = (await req.json()) as Body;
    if (!productId || !credits) {
      return NextResponse.json({ error: "Missing productId or credits" }, { status: 400 });
    }

    const payload = {
      product_id: productId,
      success_url: CREEM_SUCCESS_URL,
      metadata: {
        user_id: user.id,
        product_type: "credits",
        credits,
        product_id: productId, // Add product_id to metadata for bonus calculation
      },
    };

    const res = await fetch(`${CREEM_API_URL}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CREEM_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Failed to create checkout" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ checkoutUrl: data?.checkout_url || data?.url || null });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}


