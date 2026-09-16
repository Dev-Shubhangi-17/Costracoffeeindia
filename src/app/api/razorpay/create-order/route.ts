import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createOrderRecord, generatePublicOrderId } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = "INR",
      receipt,
      customerName = "Valued Customer",
      customerEmail = "",
      customerPhone = "",
      items = [],
      shippingAddress = "",
    } = body;

    let amountInPaise = amount;
    if (typeof amount === "number" && amount < 100) {
      amountInPaise = Math.round(amount * 100);
    } else if (typeof amount === "number") {
      amountInPaise = amount < 1000 ? Math.round(amount * 100) : Math.round(amount);
    }

    if (typeof amountInPaise !== "number" || isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount. Minimum amount is 100 paise (1 INR)." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay API Error: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.");
      return NextResponse.json(
        { success: false, error: "Razorpay authentication failed. Missing API credentials." },
        { status: 401 }
      );
    }

    const publicOrderId = generatePublicOrderId();

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        store: "COSTRA Coffee",
        brand: "Swati Gruh Udhyog",
        publicOrderId: publicOrderId,
        customerPhone: customerPhone,
      },
    };

    const order = await razorpay.orders.create(options);

    await createOrderRecord({
      publicOrderId: publicOrderId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal: Math.round(amountInPaise / 100),
      deliveryFee: 0,
      totalAmount: Math.round(amountInPaise / 100),
      currency,
      paymentStatus: "pending",
      orderStatus: "order_placed",
      razorpayOrderId: order.id,
      shippingAddress,
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      public_order_id: publicOrderId,
      publicOrderId: publicOrderId,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error: unknown) {
    console.error("Razorpay Order Creation Exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create Razorpay payment order.";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
