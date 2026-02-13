import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import PortfolioItem from "@/lib/models/PortfolioItem";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, string> = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const items = await PortfolioItem.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await getSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const item = await PortfolioItem.create(body);

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
