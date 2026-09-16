import { NextResponse } from "next/server";
import { getAllOrders, updateOrderRecord, OrderStatus } from "@/lib/orders";
import { NotificationService } from "@/lib/notifications";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "costra_admin_secret_2026";

function authenticateAdmin(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secretKeyParam = url.searchParams.get("secretKey");

  if (authHeader && authHeader.replace("Bearer ", "") === ADMIN_SECRET) {
    return true;
  }
  if (secretKeyParam === ADMIN_SECRET) {
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  if (!authenticateAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access. Admin key required." },
      { status: 401 }
    );
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    console.error("Admin Fetch Orders Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!authenticateAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access. Admin key required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { publicOrderId, orderStatus, paymentStatus } = body;

    if (!publicOrderId || !orderStatus) {
      return NextResponse.json(
        { success: false, error: "Public Order ID and new Order Status are required." },
        { status: 400 }
      );
    }

    const updated = await updateOrderRecord(publicOrderId, {
      orderStatus: orderStatus as OrderStatus,
      ...(paymentStatus ? { paymentStatus } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    // Trigger customer notification for status change
    await NotificationService.sendStatusUpdate(updated, orderStatus as OrderStatus);

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      order: updated,
    });
  } catch (error: unknown) {
    console.error("Admin Update Order Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update order status";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
