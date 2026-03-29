import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";

const ACCOUNTS_TEST_MODE =
  process.env.ACCOUNTS_TEST_MODE === "true" || process.env.TEST_MODE === "true";

export async function POST(req: NextRequest) {
  if (ACCOUNTS_TEST_MODE) {
    const body = await req.json();
    const businessName = body?.businessName || "Test Business";
    return Response.json({
      ok: true,
      locationName: "locations/mock-123",
      title: businessName,
      message: `[TEST MODE] Google Business Profile \"${businessName}\" created successfully.`,
    });
  }

  const session = await auth();
  const accessToken = (session as unknown as Record<string, unknown>)?.accessToken as
    | string
    | undefined;

  if (!accessToken) {
    return Response.json(
      { error: "Not authenticated. Please connect your Google account first." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      businessName,
      address,
      phone,
      website,
      category,
      description,
    } = body;

    if (!businessName) {
      return Response.json(
        { error: "businessName is required" },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const mybusinessbusinessinformation =
      google.mybusinessbusinessinformation({
        version: "v1",
        auth: oauth2Client,
      });

    // First, get or create the account
    const accountsApi = google.mybusinessaccountmanagement({
      version: "v1",
      auth: oauth2Client,
    });

    const { data: accountsData } = await accountsApi.accounts.list();
    const accounts = accountsData.accounts ?? [];

    if (accounts.length === 0) {
      return Response.json(
        {
          error:
            "No Google Business account found. Please create one at business.google.com first, then retry.",
        },
        { status: 400 }
      );
    }

    const accountName = accounts[0].name!;

    // Create the business location
    const location = await mybusinessbusinessinformation.accounts.locations.create(
      {
        parent: accountName,
        requestBody: {
          title: businessName,
          phoneNumbers: phone
            ? { primaryPhone: phone }
            : undefined,
          websiteUri: website || undefined,
          storefrontAddress: address
            ? {
                addressLines: [address.street || ""],
                locality: address.city || "",
                administrativeArea: address.state || "",
                postalCode: address.zip || "",
                regionCode: "US",
              }
            : undefined,
          categories: category
            ? {
                primaryCategory: {
                  displayName: category,
                },
              }
            : undefined,
          profile: description
            ? { description }
            : undefined,
        },
      }
    );

    return Response.json({
      ok: true,
      locationName: location.data.name,
      title: location.data.title,
      message: `Google Business Profile "${businessName}" created successfully.`,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create Google Business Profile";
    console.error("GBP creation error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
