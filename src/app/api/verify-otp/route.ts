import { NextRequest, NextResponse } from "next/server";
import { decryptData } from "../../../utils/encryption";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const baseUrl = process.env.AUTH_BASE_URL;
    const response = await fetch(`${baseUrl}/api/auth.web/verify-otp`, {
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
 
          if (data?.status === 1) {
            const payload = {
              mobileNumber: data?.mobileNumber || data?.data?.mobileNumber,
              email: data?.email || data?.data?.email,
            };
            const userResponse = await fetch(`${baseUrl}/api/auth.web/user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            const userContentType = userResponse.headers.get("content-type");
            if (
              userContentType &&
              userContentType.includes("application/json")
            ) {
              let userData = await userResponse.json();

              // The user endpoint might also return encrypted data
              if (userData && userData.iv && userData.encryptedData) {
                const decryptedUserStr = decryptData(
                  userData.encryptedData,
                  userData.iv,
                );
                userData = JSON.parse(decryptedUserStr);
              }

              // Attach the tokens and user to our main data object so the frontend can consume them
              data.userAuth = userData;
            }
          }
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
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
