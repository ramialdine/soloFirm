import type { AutomationParams, PlatformCredentials, AutomationPlatform } from "../../types/automation";
import { runGmailSignup } from "./gmail";
import { runInstagramSignup } from "./instagram";
import { runFacebookSignup } from "./facebook";
import { runTwitterSignup } from "./twitter";
import { runTikTokSignup } from "./tiktok";
import { runLinkedInSignup } from "./linkedin";
import { runYouTubeSetup } from "./youtube";

type EmitFn = (msg: string) => void;
type PauseFn = (reason: "paused_phone" | "paused_sms" | "paused_captcha") => Promise<string>;

interface Session {
  credentials: Partial<Record<AutomationPlatform, PlatformCredentials>>;
}

const DEFAULT_PLATFORMS: AutomationPlatform[] = [
  "gmail", "instagram", "facebook", "twitter", "tiktok", "linkedin", "youtube",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runSocialSetup(session: Session, stagehand: any, page: any, params: AutomationParams, emit: EmitFn, pause: PauseFn): Promise<void> {
  const platforms = params.platforms ?? DEFAULT_PLATFORMS;

  let gmailCreds: PlatformCredentials | undefined;

  if (platforms.includes("gmail")) {
    emit("Starting Gmail account creation…");
    gmailCreds = await runGmailSignup(stagehand, page, params, emit, pause);
    session.credentials.gmail = gmailCreds;
    emit("Gmail done.");
  }

  if (!gmailCreds) {
    emit("Skipping remaining platforms — Gmail credentials required first.");
    return;
  }

  for (const platform of platforms) {
    if (platform === "gmail") continue;
    try {
      switch (platform) {
        case "instagram": {
          emit("Starting Instagram account creation…");
          const creds = await runInstagramSignup(stagehand, page, gmailCreds, params, emit, pause);
          session.credentials.instagram = creds;
          emit("Instagram done.");
          break;
        }
        case "facebook": {
          emit("Starting Facebook account creation…");
          const creds = await runFacebookSignup(stagehand, page, gmailCreds, params, emit, pause);
          session.credentials.facebook = creds;
          emit("Facebook done.");
          break;
        }
        case "twitter": {
          emit("Starting X/Twitter account creation…");
          const creds = await runTwitterSignup(stagehand, page, gmailCreds, params, emit, pause);
          session.credentials.twitter = creds;
          emit("X/Twitter done.");
          break;
        }
        case "tiktok": {
          emit("Starting TikTok account creation…");
          const creds = await runTikTokSignup(stagehand, page, gmailCreds, params, emit, pause);
          session.credentials.tiktok = creds;
          emit("TikTok done.");
          break;
        }
        case "linkedin": {
          emit("Starting LinkedIn account creation…");
          const creds = await runLinkedInSignup(stagehand, page, gmailCreds, params, emit, pause);
          session.credentials.linkedin = creds;
          emit("LinkedIn done.");
          break;
        }
        case "youtube": {
          emit("Starting YouTube channel setup…");
          const creds = await runYouTubeSetup(stagehand, page, gmailCreds, params, emit, pause);
          session.credentials.youtube = creds;
          emit("YouTube done.");
          break;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      emit(`Error setting up ${platform}: ${msg}. Continuing…`);
    }
  }
}
