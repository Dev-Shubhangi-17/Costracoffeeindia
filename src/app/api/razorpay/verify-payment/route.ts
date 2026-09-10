import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Validate required payload parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay payment response parameters." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Razorpay Verification Error: RAZORPAY_KEY_SECRET missing in server environment.");
      return NextResponse.json(
        { success: false, error: "Server authentication error during payment verification." },
        { status: 500 }
      );
    }

    // 2. Generate expected signature using HMAC-SHA256
    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signatureBody)
      .digest("hex");

    // 3. Perform timing-safe cryptographic comparison
    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (isAuthentic) {
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully.",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.warn("Razorpay Verification Warning: Signature mismatch detected for order", razorpay_order_id);
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid transaction signature." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Razorpay Verification Exception:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while verifying the payment.";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
