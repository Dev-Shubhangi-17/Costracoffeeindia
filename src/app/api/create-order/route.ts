import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt } = body;

    // 1. Determine amount in paise (minimum 100 paise = 1 INR)
    // If amount is passed in INR (e.g. 199), convert to paise (19900).
    let amountInPaise = amount;
    if (typeof amount === "number" && amount < 100) {
      amountInPaise = Math.round(amount * 100);
    } else if (typeof amount === "number") {
      // If passed e.g. 199 in INR, check if it was intended as INR or paise
      // If user passes 199, amount * 100 = 19900 paise
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
      console.error("Razorpay Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing.");
      return NextResponse.json(
        { success: false, error: "Razorpay authentication failed. Missing credentials." },
        { status: 401 }
      );
    }

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
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error: unknown) {
    console.error("Razorpay Order Creation Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create Razorpay order.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
