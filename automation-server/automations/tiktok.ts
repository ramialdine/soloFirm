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
export async function runTikTokSignup(stagehand: any, page: any, gmailCreds: PlatformCredentials, params: { businessName: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  const password = generatePassword();
  emit("Navigating to TikTok signup…");
  await page.goto("https://www.tiktok.com/signup");
  await page.waitForLoadState("networkidle");
  emit("Signing up with email…");
  await stagehand.act("Click Sign up with email or phone");
  await page.waitForLoadState("networkidle");
  await stagehand.act(`Type "${gmailCreds.email}" into the email field`);
  await stagehand.act("Click Send code");
  emit("TikTok sent a code to your Gmail — enter it below…");
  const code = await pause("paused_sms");
  await stagehand.act(`Type "${code}" into the verification code field`);
  await stagehand.act(`Type "${password}" into the password field`);
  await stagehand.act("Click Next or Sign up");
  await page.waitForLoadState("networkidle");
  try {
    emit("Entering birthday…");
    await stagehand.act("Select January for month");
    await stagehand.act("Select 15 for day");
    await stagehand.act("Select 1990 for year");
    await stagehand.act("Click Next");
    await page.waitForLoadState("networkidle");
  } catch { /* optional */ }
  emit(`TikTok account created for ${params.businessName}`);
  return { email: gmailCreds.email, username: params.businessName, password };
}
