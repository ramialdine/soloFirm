"use client";

import { useState, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import type {
  PlatformId,
  AccountStatus,
  PlatformAccount,
  Presentation,
} from "@/types/agents";

// ── Platform configs ──

interface PlatformConfig {
  id: PlatformId;
  label: string;
  color: string;
  signupUrl: string;
  canAutoCreate: boolean;
  supportsGoogleSignIn: boolean;
  iconPath: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "google-business",
    label: "Google Business Profile",
    color: "#4285F4",
    signupUrl: "https://business.google.com",
    canAutoCreate: true,
    supportsGoogleSignIn: true,
    iconPath:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "#FF0000",
    signupUrl: "https://www.youtube.com/create_channel",
    canAutoCreate: true,
    supportsGoogleSignIn: true,
    iconPath:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    signupUrl: "https://www.instagram.com/accounts/emailsignup/",
    canAutoCreate: false,
    supportsGoogleSignIn: false,
    iconPath:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    id: "facebook",
    label: "Facebook Page",
    color: "#1877F2",
    signupUrl: "https://www.facebook.com/pages/create",
    canAutoCreate: false,
    supportsGoogleSignIn: false,
    iconPath:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    color: "#000000",
    signupUrl: "https://twitter.com/i/flow/signup",
    canAutoCreate: false,
    supportsGoogleSignIn: true,
    iconPath:
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#000000",
    signupUrl: "https://www.tiktok.com/signup",
    canAutoCreate: false,
    supportsGoogleSignIn: false,
    iconPath:
      "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  {
    id: "linkedin",
    label: "LinkedIn Page",
    color: "#0A66C2",
    signupUrl: "https://www.linkedin.com/company/setup/new/",
    canAutoCreate: false,
    supportsGoogleSignIn: false,
    iconPath:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

function generateUsername(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .slice(0, 20);
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shrink-0"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ── Platform Card ──

interface PlatformCardProps {
  platform: PlatformConfig;
  account: PlatformAccount;
  fields: { displayName: string; username: string; bio: string };
  googleConnected: boolean;
  onStatusChange: (status: AccountStatus) => void;
  onAutoCreate: () => void;
  creating?: boolean;
}

function PlatformCard({
  platform,
  account,
  fields,
  googleConnected,
  onStatusChange,
  onAutoCreate,
  creating,
}: PlatformCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusColors: Record<AccountStatus, string> = {
    "not-started": "bg-zinc-100 text-zinc-500",
    "in-progress": "bg-amber-100 text-amber-700",
    created: "bg-emerald-100 text-emerald-700",
    skipped: "bg-zinc-100 text-zinc-400",
  };

  const statusLabels: Record<AccountStatus, string> = {
    "not-started": "Not started",
    "in-progress": "In progress",
    created: "Created",
    skipped: "Skipped",
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        account.status === "created"
          ? "border-emerald-200 bg-emerald-50/30"
          : account.status === "skipped"
            ? "border-zinc-100 bg-zinc-50/50 opacity-60"
            : "border-zinc-200 bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${platform.color}12` }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={platform.color}>
            <path d={platform.iconPath} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900">{platform.label}</p>
          {account.status === "created" && account.username && (
            <p className="text-xs text-emerald-600">@{account.username}</p>
          )}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[account.status]}`}>
          {statusLabels[account.status]}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-zinc-400 hover:text-zinc-700 p-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-100 px-4 py-4 space-y-3">
          {/* Pre-filled fields */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-400 mb-0.5">Display Name</p>
                <p className="text-sm text-zinc-800 font-medium truncate">{fields.displayName}</p>
              </div>
              <CopyButton text={fields.displayName} label="Copy" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-400 mb-0.5">Username</p>
                <p className="text-sm text-zinc-800 font-mono truncate">@{fields.username}</p>
              </div>
              <CopyButton text={fields.username} label="Copy" />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-400 mb-0.5">Bio</p>
                <p className="text-sm text-zinc-700 leading-snug line-clamp-3">{fields.bio}</p>
              </div>
              <CopyButton text={fields.bio} label="Copy" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {platform.canAutoCreate && googleConnected ? (
              <button
                type="button"
                onClick={onAutoCreate}
                disabled={creating || account.status === "created"}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {creating ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    Creating...
                  </>
                ) : account.status === "created" ? (
                  "Created"
                ) : (
                  "Auto-Create"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  // Copy all fields to clipboard first
                  const clipText = `Display Name: ${fields.displayName}\nUsername: ${fields.username}\nBio: ${fields.bio}`;
                  navigator.clipboard.writeText(clipText);
                  // Open signup in a popup window so user stays on SoloFirm
                  const w = 600, h = 700;
                  const left = window.screenX + (window.outerWidth - w) / 2;
                  const top = window.screenY + (window.outerHeight - h) / 2;
                  window.open(
                    platform.signupUrl,
                    `${platform.id}_signup`,
                    `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
                  );
                  onStatusChange("in-progress");
                }}
                disabled={account.status === "created"}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" />
                </svg>
                Copy Info & Open Signup
              </button>
            )}

            {platform.supportsGoogleSignIn && !platform.canAutoCreate && (
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#4285F4">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Supports "Sign in with Google"
              </span>
            )}

            {account.status !== "created" && account.status !== "skipped" && (
              <>
                <button
                  type="button"
                  onClick={() => onStatusChange("created")}
                  className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  Mark as Created
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange("skipped")}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  Skip
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Wizard ──

interface AccountSetupWizardProps {
  presentation: Presentation;
  businessLocation?: string;
}

export default function AccountSetupWizard({
  presentation,
  businessLocation,
}: AccountSetupWizardProps) {
  const { data: session } = useSession();
  const googleConnected = !!session?.user;

  const [accounts, setAccounts] = useState<Record<PlatformId, PlatformAccount>>(() => {
    const init: Partial<Record<PlatformId, PlatformAccount>> = {};
    for (const p of PLATFORMS) {
      init[p.id] = { platformId: p.id, status: "not-started" };
    }
    return init as Record<PlatformId, PlatformAccount>;
  });

  const [creatingGBP, setCreatingGBP] = useState(false);
  const [creatingYT, setCreatingYT] = useState(false);

  const businessName = presentation.businessName;
  const username = generateUsername(businessName);
  const tagline = presentation.tagline;

  const updateAccount = useCallback(
    (platformId: PlatformId, update: Partial<PlatformAccount>) => {
      setAccounts((prev) => ({
        ...prev,
        [platformId]: { ...prev[platformId], ...update },
      }));
    },
    []
  );

  const handleAutoCreateGBP = async () => {
    setCreatingGBP(true);
    try {
      const res = await fetch("/api/accounts/google-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          description: tagline,
          address: businessLocation
            ? { state: businessLocation }
            : undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        updateAccount("google-business", {
          status: "created",
          url: `https://business.google.com`,
        });
      } else {
        // If auto-create fails, fall back to manual
        window.open("https://business.google.com", "_blank");
        updateAccount("google-business", { status: "in-progress" });
      }
    } catch {
      window.open("https://business.google.com", "_blank");
      updateAccount("google-business", { status: "in-progress" });
    }
    setCreatingGBP(false);
  };

  const handleAutoCreateYT = async () => {
    setCreatingYT(true);
    try {
      const res = await fetch("/api/accounts/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelName: businessName,
          description: tagline,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        updateAccount("youtube", {
          status: "created",
          url: data.url,
        });
      } else if (data.createUrl) {
        // Channel doesn't exist yet — open creation page in popup
        const w = 600, h = 700;
        const left = window.screenX + (window.outerWidth - w) / 2;
        const top = window.screenY + (window.outerHeight - h) / 2;
        window.open(
          data.createUrl,
          "youtube_create",
          `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
        );
        updateAccount("youtube", { status: "in-progress" });
      }
    } catch {
      const w = 600, h = 700;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      window.open(
        "https://www.youtube.com/create_channel",
        "youtube_create",
        `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
      );
      updateAccount("youtube", { status: "in-progress" });
    }
    setCreatingYT(false);
  };

  const completedCount = Object.values(accounts).filter(
    (a) => a.status === "created" || a.status === "skipped"
  ).length;
  const progress = Math.round((completedCount / PLATFORMS.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Set Up Your Accounts</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            We&apos;ve pre-filled everything. Open each platform, paste your info, and you&apos;re live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400">
            {completedCount}/{PLATFORMS.length}
          </span>
        </div>
      </div>

      {/* Google OAuth connection */}
      {!googleConnected ? (
        <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-900">Connect your Google account</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Create a new Google account for your business (e.g., {username}.hq@gmail.com) then connect it here.
                This unlocks auto-creation for Google Business Profile and enables &quot;Sign in with Google&quot; for other platforms.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const w = 600, h = 700;
                    const left = window.screenX + (window.outerWidth - w) / 2;
                    const top = window.screenY + (window.outerHeight - h) / 2;
                    window.open(
                      "https://accounts.google.com/signup",
                      "google_signup",
                      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
                    );
                  }}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  1. Create Google Account
                </button>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  2. Connect Google Account
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
          <span className="text-sm text-emerald-800 font-medium">
            Connected as {session.user?.email}
          </span>
        </div>
      )}

      {/* Platform cards */}
      <div className="space-y-2">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            account={accounts[platform.id]}
            fields={{
              displayName: businessName,
              username,
              bio: `${tagline} | ${businessLocation ?? ""}`.trim().replace(/\|$/, "").trim(),
            }}
            googleConnected={googleConnected}
            onStatusChange={(status) => updateAccount(platform.id, { status, username })}
            onAutoCreate={
              platform.id === "google-business"
                ? handleAutoCreateGBP
                : platform.id === "youtube"
                  ? handleAutoCreateYT
                  : () => {}
            }
            creating={
              platform.id === "google-business"
                ? creatingGBP
                : platform.id === "youtube"
                  ? creatingYT
                  : false
            }
          />
        ))}
      </div>
    </div>
  );
}
