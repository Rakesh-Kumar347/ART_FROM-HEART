import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import PortfolioItem from "@/lib/models/PortfolioItem";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const item = await PortfolioItem.findById(params.id).lean();
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await getSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const item = await PortfolioItem.findByIdAndUpdate(params.id, body, {
      new: true,
    }).lean();

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await getSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const item = await PortfolioItem.findByIdAndDelete(params.id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
