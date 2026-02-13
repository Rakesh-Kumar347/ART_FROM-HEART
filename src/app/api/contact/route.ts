import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email sending is handled client-side via EmailJS
    // This endpoint validates the data and could log contacts to DB if needed

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
