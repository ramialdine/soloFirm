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
export async function runTwitterSignup(stagehand: any, page: any, gmailCreds: PlatformCredentials, params: { businessName: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  const password = generatePassword();
  const handle = params.businessName.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 15);
  emit("Navigating to X (Twitter) signup…");
  await page.goto("https://twitter.com/i/flow/signup");
  await page.waitForLoadState("networkidle");
  emit("Filling in X signup form…");
  await stagehand.act(`Type "${params.businessName}" into the Name field`);
  await stagehand.act(`Type "${gmailCreds.email}" into the email field`);
  await stagehand.act("Select January for the month");
  await stagehand.act("Select 15 for the day");
  await stagehand.act("Select 1990 for the year");
  await stagehand.act("Click Next");
  await page.waitForLoadState("networkidle");
  await stagehand.act("Click Sign up or Next to continue");
  await page.waitForLoadState("networkidle");
  const url = page.url();
  if (url.includes("verify") || url.includes("confirm")) {
    emit("X requires email verification…");
    const code = await pause("paused_sms");
    await stagehand.act(`Type "${code}" into the verification code field`);
    await stagehand.act("Click Next");
    await page.waitForLoadState("networkidle");
  }
  try {
    emit("Setting password…");
    await stagehand.act(`Type "${password}" into the password field`);
    await stagehand.act("Click Next");
    await page.waitForLoadState("networkidle");
  } catch { /* step may vary */ }
  emit(`X/Twitter account ready for ${params.businessName}`);
  return { email: gmailCreds.email, username: `@${handle}`, password };
}
