import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  const session = await auth();
  const accessToken = (session as unknown as Record<string, unknown>)
    ?.accessToken as string | undefined;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated. Please connect your Google account first." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { channelName, description } = body;

    if (!channelName) {
      return Response.json(
        { error: "channelName is required" },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Create a YouTube channel by inserting a channel resource
    // This creates a brand account channel linked to the Google account
    const response = await youtube.channels.list({
      part: ["snippet", "contentDetails"],
      mine: true,
    });

    const existingChannels = response.data.items ?? [];

    if (existingChannels.length > 0) {
      // Channel already exists — update its branding
      const channelId = existingChannels[0].id!;

      await youtube.channels.update({
        part: ["brandingSettings"],
        requestBody: {
          id: channelId,
          brandingSettings: {
            channel: {
              title: channelName,
              description: description || "",
            },
          },
        },
      });

      return Response.json({
        ok: true,
        channelId,
        url: `https://www.youtube.com/channel/${channelId}`,
        message: `YouTube channel updated to "${channelName}".`,
        existing: true,
      });
    }

    // No channel exists — guide user to create one
    // YouTube doesn't have a direct "create channel" API endpoint
    // The channel is auto-created when the user first uploads or comments
    return Response.json({
      ok: false,
      error:
        "No YouTube channel found for this Google account. Please visit youtube.com and click 'Create a channel' first, then retry to update branding.",
      createUrl: "https://www.youtube.com/create_channel",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to set up YouTube channel";
    console.error("YouTube setup error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
