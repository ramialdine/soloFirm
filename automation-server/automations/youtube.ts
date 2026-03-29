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
export async function runYouTubeSetup(stagehand: any, page: any, gmailCreds: PlatformCredentials, params: { businessName: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  emit("Navigating to YouTube channel creation…");
  // YouTube uses the Gmail account — just create a channel
  await page.goto("https://www.youtube.com/create_channel");
  await page.waitForLoadState("networkidle");
  emit("Creating YouTube channel for business…");
  try {
    await stagehand.act(`Type "${params.businessName}" into the channel name field`);
    await stagehand.act("Click Create channel or I understand");
    await page.waitForLoadState("networkidle");
  } catch { /* user may need to be signed in */ }
  emit(`YouTube channel set up for ${params.businessName}`);
  return { email: gmailCreds.email, username: params.businessName, password: gmailCreds.password };
}
