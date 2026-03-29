export type AutomationStatus =
  | "idle"
  | "running"
  | "paused_phone"
  | "paused_sms"
  | "paused_captcha"
  | "complete"
  | "error";

export type AutomationPlatform = "gmail" | "instagram" | "facebook" | "twitter" | "tiktok" | "linkedin" | "youtube";

export interface AutomationParams {
  businessName: string;
  founderName?: string;
  platforms: AutomationPlatform[];
}

export interface PlatformCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AutomationLogEntry {
  type: "log" | "screenshot" | "status" | "credential" | "error";
  message?: string;
  screenshotDataUrl?: string;
  status?: AutomationStatus;
  platform?: AutomationPlatform;
  credentials?: PlatformCredentials;
  timestamp: string;
}

export interface AutomationSessionInfo {
  sessionId: string;
  status: AutomationStatus;
  credentials: Partial<Record<AutomationPlatform, PlatformCredentials>>;
}
