import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createToken,
  setSessionCookie,
  getSession,
  clearSession,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = await createToken();
    await setSessionCookie(token);

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const authenticated = await getSession();
    return NextResponse.json({ authenticated });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
