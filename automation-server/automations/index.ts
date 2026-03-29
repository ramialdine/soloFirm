import type { AutomationParams, PlatformCredentials, AutomationPlatform } from "../../types/automation";
import { runGmailSignup } from "./gmail";
import { runInstagramSignup } from "./instagram";

type EmitFn = (msg: string) => void;
type PauseFn = (reason: "paused_phone" | "paused_sms" | "paused_captcha") => Promise<string>;

interface Session {
  credentials: Partial<Record<AutomationPlatform, PlatformCredentials>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runSocialSetup(session: Session, stagehand: any, params: AutomationParams, emit: EmitFn, pause: PauseFn): Promise<void> {
  const platforms = params.platforms ?? ["gmail", "instagram"];

  let gmailCreds: PlatformCredentials | undefined;

  if (platforms.includes("gmail")) {
    emit("Starting Gmail account creation…");
    gmailCreds = await runGmailSignup(stagehand, params, emit, pause);
    session.credentials.gmail = gmailCreds;
    emit("Gmail done.");
  }

  if (platforms.includes("instagram")) {
    if (!gmailCreds) {
      emit("Skipping Instagram — Gmail credentials required first.");
      return;
    }
    emit("Starting Instagram account creation…");
    const igCreds = await runInstagramSignup(stagehand, gmailCreds, params, emit, pause);
    session.credentials.instagram = igCreds;
    emit("Instagram done.");
  }
}
