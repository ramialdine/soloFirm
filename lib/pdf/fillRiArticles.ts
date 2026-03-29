import { PDFDocument } from "pdf-lib";
import { readFile } from "fs/promises";
import { join } from "path";
import type { LlcFormData } from "./types";

/**
 * Fill the Rhode Island Form 400 — Articles of Organization for a Domestic LLC.
 *
 * Field mapping (determined by filling each field with its name and inspecting the output):
 *
 * PAGE 2 — Articles of Organization
 *   "2"  = §1 LLC Name
 *   "3"  = §2 Resident Agent Name
 *   "4"  = §2 Resident Agent Street Address
 *   "5"  = §2 Resident Agent City/Town
 *   "6"  = §2 Resident Agent Zip Code
 *   "Check Box 6" = §3 Disregarded entity (single-member LLC)
 *   "Check Box 7" = §3 Partnership
 *   "Check Box 8" = §3 Corporation
 *   "7"  = §4 Principal Office Street Address
 *   "8"  = §4 Principal Office City/Town
 *   "9"  = §4 Principal Office State
 *   "10" = §4 Principal Office Zip Code
 *
 * PAGE 3 — Continuation
 *   "11" = §6 Additional provisions (optional)
 *   "Check Box 9"  = §6 Attachment indicator
 *   "Check Box 2"  = §7 Member-managed
 *   "Check Box 3"  = §7 Manager-managed
 *   "16" = §7 Manager 1 Name
 *   "30" = §7 Manager 1 Address
 *   "27" = §7 Manager 2 Name
 *   "29" = §7 Manager 2 Address
 *   "Check Box 10" = §7 Attachment indicator
 *   "Check Box 4"  = §8 Date received (upon filing)
 *   "Check Box 5"  = §8 Later effective date
 *   "20" = §8 Later effective date value
 *   "21" = §9 Authorized Person Name
 *   "22" = §9 Authorized Person Address
 *   "23" = §9 Authorized Person City/Town
 *   "24" = §9 Authorized Person State
 *   "25" = §9 Authorized Person Zip Code
 *   "26" = §9 Date
 *
 * PAGE 4 — Filer Contact Information
 *   "Text Field 104"  = Filer Name
 *   "Text Field 105"  = Filer Date
 *   "Text Field 106"  = Proposed Entity Name
 *   "Text Field 107"  = Filer Street Address
 *   "Text Field 108"  = Filer City
 *   "Text Field 109"  = Filer State
 *   "Text Field 1010" = Filer Zip Code
 *   "Text Field 1011" = Filer Email
 *   "Text Field 1012" = Filer Phone
 */
export async function fillRiArticles(data: LlcFormData): Promise<Uint8Array> {
  const pdfPath = join(process.cwd(), "public", "forms", "ri-articles-of-organization.pdf");
  const pdfBytes = await readFile(pdfPath);
  const doc = await PDFDocument.load(pdfBytes);
  const form = doc.getForm();

  // --- §1: LLC Name ---
  const llcName = data.businessName.match(/l\.?l\.?c\.?|limited liability company/i)
    ? data.businessName
    : `${data.businessName}, LLC`;
  form.getTextField("2").setText(llcName);

  // --- §3: Federal tax treatment ---
  // Solo founder → single-member LLC → disregarded entity
  // Multiple founders → partnership (most common for multi-member LLCs)
  const isSolo = /solo/i.test(data.teamSize);
  if (isSolo) {
    form.getCheckBox("Check Box 6").check(); // disregarded entity
  } else {
    form.getCheckBox("Check Box 7").check(); // partnership
  }

  // --- §4: Principal office state ---
  form.getTextField("9").setText("Rhode Island");

  // --- §7: Management structure ---
  // Solo → member-managed; team → also default to member-managed (safer default)
  form.getCheckBox("Check Box 2").check(); // Members (Owners)

  // --- §8: Effective date = Date received (upon filing) ---
  form.getCheckBox("Check Box 4").check();

  // --- Page 4: Filer Contact — Proposed Entity Name ---
  form.getTextField("Text Field 106").setText(llcName);

  // Flatten so the filled values display in any PDF viewer (not just Adobe)
  // But keep it editable so the user can fill in remaining fields
  // form.flatten(); // intentionally NOT flattened

  return doc.save();
}
