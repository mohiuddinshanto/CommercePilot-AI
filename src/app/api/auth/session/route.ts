import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const sessionToken =
    authHeader?.replace("Bearer ", "") ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(null);
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
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
