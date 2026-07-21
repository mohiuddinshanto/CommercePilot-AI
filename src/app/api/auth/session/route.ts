import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(null);
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        Cookie: `__Secure-better-auth.session_token=${sessionToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(null);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
