import { NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderById, updateOrderRecord } from "@/lib/orders";
import { NotificationService } from "@/lib/notifications";

const processedWebhookEvents = new Set<string>();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "costra_webhook_secret_2026";

    // 1. Validate signature if header is present
    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const isAuthentic = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );

      if (!isAuthentic) {
        console.warn("Razorpay Webhook Error: Invalid signature received.");
        return NextResponse.json(
          { success: false, error: "Invalid webhook signature." },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || `${payload.event}_${Date.now()}`;

    // 2. Idempotency Check
    if (processedWebhookEvents.has(eventId)) {
      console.log(`[Razorpay Webhook] Idempotent duplicate skipped for event ${eventId}`);
      return NextResponse.json({ success: true, message: "Duplicate webhook event acknowledged." });
    }
    processedWebhookEvents.add(eventId);

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;

    if (razorpayOrderId) {
      const existingOrder = await getOrderById(razorpayOrderId);
      if (existingOrder) {
        if (event === "payment.captured" || event === "order.paid") {
          const updated = await updateOrderRecord(existingOrder.publicOrderId, {
            paymentStatus: "paid",
            orderStatus: "payment_confirmed",
            razorpayPaymentId: razorpayPaymentId || existingOrder.razorpayPaymentId,
          });

          if (updated) {
            await NotificationService.sendOrderConfirmation(updated);
          }
        } else if (event === "payment.failed") {
          await updateOrderRecord(existingOrder.publicOrderId, {
            paymentStatus: "failed",
          });
        }
      }
    }

    return NextResponse.json({ success: true, status: "processed", event });
  } catch (error: unknown) {
    console.error("Razorpay Webhook Exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Error processing webhook";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
