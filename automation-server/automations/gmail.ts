import type { PlatformCredentials } from "../../types/automation";

type EmitFn = (msg: string) => void;
type PauseFn = (reason: "paused_phone" | "paused_sms" | "paused_captcha") => Promise<string>;

/** Generates username candidates from a business name */
function usernameFromBusiness(name: string): string[] {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20);
  return [base, `${base}.biz`, `${base}.hq`, `${base}official`, `get${base}`];
}

/** Generates a strong random password */
function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
  const core = Array.from({ length: 12 }, () => rand(all)).join("");
  // Guarantee at least one of each required class
  return rand(upper) + rand(lower) + rand(digits) + rand(symbols) + core;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runGmailSignup(stagehand: any, params: { businessName: string; founderName?: string }, emit: EmitFn, pause: PauseFn): Promise<PlatformCredentials> {
  const page = stagehand.context.activePage();
  const password = generatePassword();
  const [firstName, ...lastParts] = (params.founderName ?? params.businessName).split(" ");
  const lastName = lastParts.join(" ") || "Owner";
  const usernames = usernameFromBusiness(params.businessName);
  let chosenUsername = usernames[0];

  emit("Navigating to Gmail signup…");
  await page.goto("https://accounts.google.com/signup/v2/createaccount?flowName=GlifWebSignIn&flowEntry=SignUp");
  await page.waitForLoadState("networkidle");

  emit("Filling in name…");
  await stagehand.act({ action: `Type "${firstName}" into the First name field` });
  await stagehand.act({ action: `Type "${lastName}" into the Last name field` });
  await stagehand.act({ action: "Click Next" });
  await page.waitForLoadState("networkidle");

  emit("Entering birthday and gender…");
  // Month: select August (birth month placeholder)
  await stagehand.act({ action: "Select August from the Month dropdown" });
  await stagehand.act({ action: 'Type "15" into the Day field' });
  await stagehand.act({ action: 'Type "1990" into the Year field' });
  await stagehand.act({ action: "Select Rather not say from the Gender dropdown" });
  await stagehand.act({ action: "Click Next" });
  await page.waitForLoadState("networkidle");

  // Try username options
  emit("Choosing a Gmail address…");
  let usernameAccepted = false;
  for (const candidate of usernames) {
    try {
      await stagehand.act({ action: "Click Create your own Gmail address" });
      await page.waitForTimeout(500);
      await stagehand.act({ action: `Clear the username field and type "${candidate}"` });
      await stagehand.act({ action: "Click Next" });
      await page.waitForLoadState("networkidle");
      // If still on same page with error, try next
      const url = page.url();
      if (url.includes("username") || url.includes("createaccount")) continue;
      chosenUsername = candidate;
      usernameAccepted = true;
      emit(`Username chosen: ${candidate}@gmail.com`);
      break;
    } catch {
      continue;
    }
  }
  if (!usernameAccepted) {
    emit("Could not auto-select a username — please select one in the browser window.");
    await pause("paused_captcha");
    // Re-read what was chosen by looking at the page
    const val = await stagehand.extract({
      instruction: "Extract the current value of the Gmail username input field",
      schema: { type: "object", properties: { username: { type: "string" } }, required: ["username"] },
    });
    chosenUsername = (val as { username?: string }).username ?? chosenUsername;
  }

  emit("Setting password…");
  await stagehand.act({ action: `Type "${password}" into the Password field` });
  await stagehand.act({ action: `Type "${password}" into the Confirm field` });
  await stagehand.act({ action: "Click Next" });
  await page.waitForLoadState("networkidle");

  // Phone verification
  const currentUrl = page.url();
  if (currentUrl.includes("phone") || currentUrl.includes("verify")) {
    emit("Phone verification required — waiting for your phone number…");
    const phone = await pause("paused_phone");
    emit("Entering phone number…");
    await stagehand.act({ action: `Type "${phone}" into the phone number field` });
    await stagehand.act({ action: "Click Next" });
    await page.waitForLoadState("networkidle");

    emit("Waiting for SMS code…");
    const smsCode = await pause("paused_sms");
    emit("Entering SMS code…");
    await stagehand.act({ action: `Type "${smsCode}" into the verification code field` });
    await stagehand.act({ action: "Click Verify" });
    await page.waitForLoadState("networkidle");
  }

  // Recovery email (skip)
  try {
    await stagehand.act({ action: "Click Skip if there is a Skip button" });
    await page.waitForTimeout(500);
  } catch { /* optional step */ }

  // Accept terms
  try {
    emit("Accepting terms…");
    await stagehand.act({ action: "Click I agree or Accept" });
    await page.waitForLoadState("networkidle");
  } catch { /* may not appear */ }

  const email = `${chosenUsername}@gmail.com`;
  emit(`Gmail account created: ${email}`);

  return { email, username: chosenUsername, password };
}
