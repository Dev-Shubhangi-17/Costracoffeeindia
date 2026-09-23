import { NextResponse } from "next/server";
import { getAllOrders, updateOrderRecord, createOrderRecord, getOrderById, generatePublicOrderId, OrderStatus } from "@/lib/orders";
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

/**
 * Automatically fetch recent paid transactions from Razorpay API to sync missing past orders
 */
async function syncRazorpayOrders(): Promise<void> {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return;
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
    const res = await fetch("https://api.razorpay.com/v1/payments?count=50", {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();
    const payments = data.items || [];

    for (const p of payments) {
      if (p.status === "captured" || p.status === "authorized") {
        const orderIdToLookup = p.order_id || p.id;
        const existing = await getOrderById(orderIdToLookup);

        if (!existing) {
          const publicOrderId = p.notes?.publicOrderId || generatePublicOrderId();
          const amountInInr = Math.round((p.amount || 0) / 100);

          await createOrderRecord({
            publicOrderId,
            customerName: p.notes?.customerName || (p.email ? p.email.split("@")[0] : "Valued Customer"),
            customerEmail: p.email || "",
            customerPhone: p.contact || p.notes?.customerPhone || "",
            items: [
              {
                id: "razorpay_item",
                name: "COSTRA Coffee Product",
                price: amountInInr,
                quantity: 1,
              },
            ],
            subtotal: amountInInr,
            deliveryFee: 0,
            totalAmount: amountInInr,
            currency: p.currency || "INR",
            paymentStatus: "paid",
            orderStatus: "payment_confirmed",
            razorpayOrderId: p.order_id || "",
            razorpayPaymentId: p.id,
            shippingAddress: p.notes?.address || "",
          });
        }
      }
    }
  } catch (err) {
    console.warn("Razorpay Live Sync Exception:", err);
  }
}

export async function GET(request: Request) {
  if (!authenticateAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access. Admin key required." },
      { status: 401 }
    );
  }

  try {
    // Sync any missing paid transactions directly from Razorpay API
    await syncRazorpayOrders();

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
