import { NextRequest, NextResponse } from "next/server";
import { decryptData } from "../../../utils/encryption";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.mobileNumber) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 },
      );
    }
    const baseUrl = process.env.AUTH_BASE_URL;
    const response = await fetch(`${baseUrl}/api/auth.web/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();

      // Check if the response matches the encrypted payload signature
      if (data && data.iv && data.encryptedData) {
        try {
          const decryptedString = decryptData(data.encryptedData, data.iv);
          // Assuming the decrypted string is JSON, parse it back into an object
          data = JSON.parse(decryptedString);
        } catch (decryptErr) {
          console.error("Failed to decrypt API response:", decryptErr);
          // If we fail to decrypt, we might want to return a 500 error
          // or just pass through the raw encrypted data depending on your needs.
          return NextResponse.json(
            { error: "Failed to decrypt response" },
            { status: 500 },
          );
        }
      }
    } else {
      // The server returned something else (probably an HTML error page or Gateway timeout)
      const rawText = await response.text();
      console.error("Non-JSON API Response:", rawText);
      return NextResponse.json(
        { error: "API returned invalid format (not JSON). Check server logs." },
        { status: response.status },
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Login API Error:", error);

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;
      if (typeof err.message === "string") {
        errorMessage = err.message;
      } else if (err.data && typeof err.data === "object") {
        const errData = err.data as Record<string, unknown>;
        if (typeof errData.message === "string") {
          errorMessage = errData.message;
        }
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
