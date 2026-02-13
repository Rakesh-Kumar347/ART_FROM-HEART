import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { getSession } from "@/lib/auth";
import { generateOrderId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const isAuth = await getSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter: Record<string, string> = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const order = await Order.create({
      ...body,
      orderId: generateOrderId(),
      status: "new",
      paymentMarked: body.paymentMarked || false,
      paymentVerified: false,
    });

    return NextResponse.json(
      { orderId: order.orderId, _id: order._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
