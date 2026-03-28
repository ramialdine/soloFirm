import { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return Response.json({ text: "" });
    }

    const sections: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const name = file.name;
      const ext = name.split(".").pop()?.toLowerCase();

      try {
        if (ext === "pdf") {
          // Dynamic import avoids module-level side effects in pdf-parse
          const pdfParseModule = await import("pdf-parse");
          const pdfParse = (pdfParseModule as unknown as { default: (buf: Buffer) => Promise<{ text: string }> }).default ?? pdfParseModule;
          const data = await pdfParse(buffer);
          const text = data.text.trim();
          if (text) {
            sections.push(`### Document: ${name}\n\n${text}`);
          }
        } else if (ext === "docx") {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          const text = result.value.trim();
          if (text) {
            sections.push(`### Document: ${name}\n\n${text}`);
          }
        } else if (ext === "txt" || ext === "md" || ext === "csv") {
          const text = buffer.toString("utf-8").trim();
          if (text) {
            sections.push(`### Document: ${name}\n\n${text}`);
          }
        }
        // Skip unsupported formats silently
      } catch {
        // If a single file fails to parse, skip it and continue
        sections.push(`### Document: ${name}\n\n[Could not parse this file — please paste the content as text instead]`);
      }
    }

    return Response.json({ text: sections.join("\n\n---\n\n") });
  } catch {
    return Response.json(
      { error: "Failed to process documents" },
      { status: 500 }
    );
  }
}
