import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    // 1. Validate payment amount
    if (typeof amount !== "number" || amount <= 0 || isNaN(amount)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount specified." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 2. Validate missing backend credentials
    if (!keyId || !keySecret) {
      console.error("Razorpay API Error: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment variables.");
      return NextResponse.json(
        { success: false, error: "Payment Gateway configuration error. Please contact store administrator." },
        { status: 500 }
      );
    }

    // 3. Initialize Razorpay Server SDK
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // 4. Convert INR amount to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        store: "COSTRA Coffee",
        brand: "Swati Gruh Udhyog",
      },
    };

    // 5. Create order with Razorpay API
    const order = await razorpay.orders.create(options);

    // 6. Return only public parameters to frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
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
