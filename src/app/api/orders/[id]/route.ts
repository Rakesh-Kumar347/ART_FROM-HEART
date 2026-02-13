import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    // Search by orderId (public) or _id
    const order = await Order.findOne({
      $or: [{ orderId: params.id }, { _id: params.id }],
    }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch order" },
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

    const order = await Order.findOneAndUpdate(
      { $or: [{ orderId: params.id }, { _id: params.id }] },
      { ...body, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
