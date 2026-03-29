/**
 * Mock automation — no browser, no API calls.
 * Simulates the full flow with realistic delays and dummy credentials.
 * Enable with: TEST_MODE=true npm run automation
 */
import type { AutomationParams, PlatformCredentials, AutomationPlatform } from "../../types/automation";

type EmitFn = (msg: string) => void;
type PauseFn = (reason: "paused_phone" | "paused_sms" | "paused_captcha") => Promise<string>;

interface Session {
  credentials: Partial<Record<AutomationPlatform, PlatformCredentials>>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 1x1 grey JPEG as a base64 placeholder screenshot
const PLACEHOLDER_SCREENSHOT =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EAB8QAAICAQUBAAAAAAAAAAAAAAECAwQFEiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCv1rUqWLhU5LkYqUlFyk0kl6b9AAdHixAAAAAA/9k=";

function makeCreds(platform: AutomationPlatform, businessName: string, email: string): PlatformCredentials {
  const base = businessName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
  const handles: Record<AutomationPlatform, string> = {
    gmail: base,
    instagram: `${base}_official`,
    facebook: businessName,
    twitter: `@${base}`,
    tiktok: `@${base}.biz`,
    linkedin: businessName,
    youtube: `${businessName} Channel`,
  };
  return {
    email: platform === "gmail" ? `${base}.business@gmail.com` : email,
    username: handles[platform],
    password: "T3st-P@ssw0rd-Mock!",
  };
}

export async function runMockSetup(
  session: Session,
  platforms: AutomationPlatform[],
  params: AutomationParams,
  emit: EmitFn,
  pause: PauseFn,
  emitScreenshot: (dataUrl: string) => void,
): Promise<void> {
  const businessName = params.businessName;
  let gmailEmail = `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}.business@gmail.com`;

  for (const platform of platforms) {
    emit(`── Starting ${platform} ──`);
    await sleep(600);

    emitScreenshot(PLACEHOLDER_SCREENSHOT);

    if (platform === "gmail") {
      emit("Navigating to Gmail signup…");
      await sleep(800);
      emit("Filling in name and birthday…");
      await sleep(700);
      emit("Choosing Gmail address…");
      await sleep(600);
      emit("Setting password…");
      await sleep(500);
      emit("Phone verification required — waiting for your phone number…");
      const phone = await pause("paused_phone");
      emit(`Got phone: ${phone.replace(/\d(?=\d{4})/g, "•")} — sending code…`);
      await sleep(1200);
      emit("Waiting for SMS code…");
      const code = await pause("paused_sms");
      emit(`Code "${code}" accepted.`);
      await sleep(800);
      emit("Accepting terms…");
      await sleep(500);
      const creds = makeCreds("gmail", businessName, "");
      gmailEmail = creds.email;
      session.credentials.gmail = creds;
      emit(`Gmail account created: ${creds.email}`);

    } else if (platform === "instagram") {
      emit("Navigating to Instagram signup…");
      await sleep(700);
      emit("Filling in form…");
      await sleep(600);
      emit("Instagram sent a confirmation code to your Gmail — enter it below…");
      const code = await pause("paused_sms");
      emit(`Code "${code}" accepted.`);
      await sleep(800);
      const creds = makeCreds("instagram", businessName, gmailEmail);
      session.credentials.instagram = creds;
      emit(`Instagram account created: ${creds.username}`);

    } else {
      // All other platforms: simulate without pauses
      const steps = [
        `Navigating to ${platform} signup…`,
        "Filling in account details…",
        "Submitting form…",
        "Verifying with Gmail…",
      ];
      for (const step of steps) {
        emit(step);
        await sleep(500 + Math.random() * 400);
        emitScreenshot(PLACEHOLDER_SCREENSHOT);
      }
      const creds = makeCreds(platform as AutomationPlatform, businessName, gmailEmail);
      session.credentials[platform as AutomationPlatform] = creds;
      emit(`${platform} account created: ${creds.username}`);
    }

    await sleep(400);
  }
}
