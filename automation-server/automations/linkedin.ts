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
export async function runLinkedInSignup(stagehand: any, page: any, gmailCreds: PlatformCredentials, params: { businessName: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  const password = generatePassword();
  const [firstName, ...lastParts] = params.businessName.split(" ");
  const lastName = lastParts.join(" ") || "Business";
  emit("Navigating to LinkedIn signup…");
  await page.goto("https://www.linkedin.com/signup");
  await page.waitForLoadState("networkidle");
  emit("Filling in LinkedIn signup…");
  await stagehand.act(`Type "${gmailCreds.email}" into the email field`);
  await stagehand.act(`Type "${password}" into the password field`);
  await stagehand.act("Click Join now or Agree and join");
  await page.waitForLoadState("networkidle");
  try {
    await stagehand.act(`Type "${firstName}" into the First name field`);
    await stagehand.act(`Type "${lastName}" into the Last name field`);
    await stagehand.act("Click Continue");
    await page.waitForLoadState("networkidle");
  } catch { /* step may vary */ }
  const url = page.url();
  if (url.includes("verify") || url.includes("checkpoint")) {
    emit("LinkedIn requires email verification…");
    const code = await pause("paused_sms");
    await stagehand.act(`Type "${code}" into the verification code field`);
    await stagehand.act("Click Submit or Verify");
    await page.waitForLoadState("networkidle");
  }
  emit(`LinkedIn account created for ${params.businessName}`);
  return { email: gmailCreds.email, username: `${firstName} ${lastName}`, password };
}
