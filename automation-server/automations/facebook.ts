import type { PlatformCredentials } from "../../types/automation";

type EmitFn = (msg: string) => void;
type PauseFn = (reason: "paused_phone" | "paused_sms" | "paused_captcha") => Promise<string>;

function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
  const core = Array.from({ length: 12 }, () => rand(all)).join("");
  return rand(upper) + rand(lower) + rand(digits) + rand(symbols) + core;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runFacebookSignup(stagehand: any, page: any, gmailCreds: PlatformCredentials, params: { businessName: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  const password = generatePassword();
  const [firstName, ...lastParts] = params.businessName.split(" ");
  const lastName = lastParts.join(" ") || "Business";
  emit("Navigating to Facebook signup…");
  await page.goto("https://www.facebook.com/r.php");
  await page.waitForLoadState("networkidle");
  emit("Filling in Facebook signup form…");
  await stagehand.act(`Type "${firstName}" into the First name field`);
  await stagehand.act(`Type "${lastName}" into the Last name field`);
  await stagehand.act(`Type "${gmailCreds.email}" into the email or phone field`);
  await stagehand.act(`Type "${password}" into the new password field`);
  await stagehand.act("Select January for birthday month");
  await stagehand.act("Select 15 for birthday day");
  await stagehand.act("Select 1990 for birthday year");
  await stagehand.act("Click Sign Up");
  await page.waitForLoadState("networkidle");
  emit("Facebook may require email or phone confirmation…");
  const url = page.url();
  if (url.includes("confirm") || url.includes("checkpoint")) {
    const code = await pause("paused_sms");
    await stagehand.act(`Type "${code}" into the confirmation code field`);
    await stagehand.act("Click Confirm or Submit");
    await page.waitForLoadState("networkidle");
  }
  emit(`Facebook account created for ${params.businessName}`);
  return { email: gmailCreds.email, username: params.businessName, password };
}
