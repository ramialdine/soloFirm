import type { PlatformCredentials } from "../../types/automation";

type EmitFn = (msg: string) => void;
type PauseFn = (reason: "paused_phone" | "paused_sms" | "paused_captcha") => Promise<string>;

function usernameFromBusiness(name: string): string[] {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 28);
  return [base, `${base}.biz`, `${base}_official`, `${base}_hq`];
}

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
export async function runInstagramSignup(stagehand: any, page: any, gmailCreds: PlatformCredentials, params: { businessName: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  const password = generatePassword();
  const usernames = usernameFromBusiness(params.businessName);
  let chosenUsername = usernames[0];

  emit("Navigating to Instagram signup…");
  await page.goto("https://www.instagram.com/accounts/emailsignup/");
  await page.waitForLoadState("networkidle");

  emit("Filling in signup form…");
  await stagehand.act(`Type "${gmailCreds.email}" into the email or phone number field`);
  await stagehand.act(`Type "${params.businessName}" into the Full Name field`);
  await stagehand.act(`Type "${chosenUsername}" into the Username field`);
  await page.waitForTimeout(1000); // allow username availability check

  // Check if username is taken
  const pageContent = await page.content();
  if (pageContent.includes("not available") || pageContent.includes("isn't available")) {
    emit("Username taken, trying alternatives…");
    for (const candidate of usernames.slice(1)) {
      await stagehand.act(`Clear the Username field and type "${candidate}"`);
      await page.waitForTimeout(1000);
      const content = await page.content();
      if (!content.includes("not available") && !content.includes("isn't available")) {
        chosenUsername = candidate;
        emit(`Username available: @${candidate}`);
        break;
      }
    }
  }

  await stagehand.act(`Type "${password}" into the Password field`);
  await stagehand.act("Click Sign up or Next");
  await page.waitForLoadState("networkidle");

  // Birthday step
  try {
    emit("Entering birthday…");
    await stagehand.act("Select January from the month selector");
    await stagehand.act("Select 15 from the day selector");
    await stagehand.act("Select 1990 from the year selector");
    await stagehand.act("Click Next");
    await page.waitForLoadState("networkidle");
  } catch { /* step may vary */ }

  // Email confirmation code
  const url = page.url();
  if (url.includes("confirm") || url.includes("verify") || url.includes("code")) {
    emit("Instagram sent a confirmation code to your Gmail — waiting for you to enter it…");
    const code = await pause("paused_sms");
    emit("Entering confirmation code…");
    await stagehand.act(`Type "${code}" into the confirmation code field`);
    await stagehand.act("Click Confirm or Next");
    await page.waitForLoadState("networkidle");
  }

  // Phone verification (sometimes required)
  const url2 = page.url();
  if (url2.includes("phone")) {
    emit("Phone verification required — waiting for your phone number…");
    const phone = await pause("paused_phone");
    await stagehand.act(`Type "${phone}" into the phone number field`);
    await stagehand.act("Click Send code");
    await page.waitForLoadState("networkidle");

    const smsCode = await pause("paused_sms");
    await stagehand.act(`Type "${smsCode}" into the SMS code field`);
    await stagehand.act("Click Confirm");
    await page.waitForLoadState("networkidle");
  }

  emit(`Instagram account created: @${chosenUsername}`);
  return { email: gmailCreds.email, username: chosenUsername, password };
}
