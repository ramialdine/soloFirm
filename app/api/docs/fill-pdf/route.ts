import { NextResponse } from "next/server";
import { fillRiArticles } from "@/lib/pdf/fillRiArticles";
import { isSupportedFormState } from "@/lib/pdf/types";
import type { LlcFormData } from "@/lib/pdf/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, teamSize, state } = body as Partial<LlcFormData>;

    if (!businessName || !state) {
      return NextResponse.json(
        { error: "businessName and state are required" },
        { status: 400 }
      );
    }

    if (!isSupportedFormState(state)) {
      return NextResponse.json(
        { error: `PDF form filling is not yet supported for ${state}` },
        { status: 400 }
      );
    }

    const data: LlcFormData = {
      businessName,
      teamSize: teamSize ?? "Solo",
      state,
    };

    const pdfBytes = await fillRiArticles(data);

    const safeName = businessName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-");

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-Articles-of-Organization.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF fill error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
