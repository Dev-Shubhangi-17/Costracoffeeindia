import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, phone } = body;

    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Order ID." },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId.trim());

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found. Please check your Order ID and try again." },
        { status: 404 }
      );
    }

    // Secure Verification: Phone Number verification if provided
    if (phone && typeof phone === "string" && phone.trim()) {
      const cleanPhoneInput = phone.replace(/\D/g, "");
      const cleanOrderPhone = order.customerPhone.replace(/\D/g, "");

      if (cleanPhoneInput.length >= 4 && cleanOrderPhone.length >= 4) {
        // Compare full or last 4 digits
        const matchFull = cleanOrderPhone === cleanPhoneInput;
        const matchLast4 = cleanOrderPhone.endsWith(cleanPhoneInput.slice(-4));

        if (!matchFull && !matchLast4) {
          return NextResponse.json(
            { success: false, error: "Verification failed. The phone number provided does not match this order." },
            { status: 401 }
          );
        }
      }
    }

    // Return sanitized customer-facing order timeline details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        publicOrderId: order.publicOrderId,
        customerName: order.customerName,
        customerPhoneMasked: order.customerPhone
          ? `${order.customerPhone.slice(0, 4)}****${order.customerPhone.slice(-2)}`
          : "",
        items: order.items,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error: unknown) {
    console.error("Order Track Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error fetching order status.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
