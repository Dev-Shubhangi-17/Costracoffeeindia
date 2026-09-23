import { NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderById, updateOrderRecord, createOrderRecord, generatePublicOrderId } from "@/lib/orders";
import { NotificationService } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const razorpay_order_id = body.razorpay_order_id || body.order_id;
    const razorpay_payment_id = body.razorpay_payment_id || body.payment_id;
    const razorpay_signature = body.razorpay_signature || body.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay parameters (order_id, payment_id, signature)." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Razorpay Verification Error: RAZORPAY_KEY_SECRET missing.");
      return NextResponse.json(
        { success: false, error: "Server authentication error during payment verification." },
        { status: 500 }
      );
    }

    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signatureBody)
      .digest("hex");

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (isAuthentic) {
      let order = await getOrderById(razorpay_order_id);

      if (!order) {
        const generatedPublicId = generatePublicOrderId();
        order = await createOrderRecord({
          publicOrderId: generatedPublicId,
          customerName: body.customerName || "Valued Customer",
          customerEmail: body.customerEmail || "",
          customerPhone: body.customerPhone || "",
          items: body.items || [],
          subtotal: body.amount ? Math.round(body.amount / 100) : 0,
          deliveryFee: 0,
          totalAmount: body.amount ? Math.round(body.amount / 100) : 0,
          currency: body.currency || "INR",
          paymentStatus: "paid",
          orderStatus: "payment_confirmed",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        });
      } else {
        order = await updateOrderRecord(order.publicOrderId, {
          paymentStatus: "paid",
          orderStatus: "payment_confirmed",
          razorpayPaymentId: razorpay_payment_id,
        });
      }

      if (order) {
        await NotificationService.sendOrderConfirmation(order);
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully.",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        publicOrderId: order?.publicOrderId || razorpay_order_id,
      });
    } else {
      console.warn("Razorpay Verification Failed: Signature mismatch for order", razorpay_order_id);
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid transaction signature." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Razorpay Verification Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred during payment verification.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
