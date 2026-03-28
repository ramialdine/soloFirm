import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    try {
      const sb = getServiceSupabase();
      const { error } = await sb
        .from("waitlist")
        .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

      if (error) {
        console.error("Supabase waitlist error:", error);
        // Still return success — we don't want to block the UX
      }
    } catch {
      // Supabase not configured — log and continue
      console.warn("Supabase not configured, waitlist entry not persisted");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
