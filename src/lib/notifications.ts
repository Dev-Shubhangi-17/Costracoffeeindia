import { OrderRecord, OrderStatus } from "./orders";

export interface NotificationLog {
  orderId: string;
  eventType: string;
  recipient: string;
  message: string;
  sentAt: string;
}

const sentNotificationsMap = new Map<string, NotificationLog>();

/**
 * Format notification templates
 */
export function buildCustomerOrderConfirmationMsg(order: OrderRecord): string {
  return `Hi ${order.customerName}!
Your Costra Coffee order #${order.publicOrderId} has been confirmed.
Order Amount: ₹${order.totalAmount}
Payment: ${order.paymentStatus === "paid" ? "Successful" : "Pending"}
Track your order here: ${process.env.NEXT_PUBLIC_SITE_URL || "https://www.costracoffeeindia.com"}/track?id=${order.publicOrderId}&phone=${encodeURIComponent(order.customerPhone)}
Thank you for ordering from Costra Coffee!`;
}

export function buildAdminOrderNotificationMsg(order: OrderRecord): string {
  return `New Costra Order
Order #${order.publicOrderId}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Amount: ₹${order.totalAmount}
Payment: ${order.paymentStatus === "paid" ? "Successful" : "Pending"}
Status: ${order.orderStatus}`;
}

export function buildStatusUpdateMsg(order: OrderRecord, status: OrderStatus): string {
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.costracoffeeindia.com"}/track?id=${order.publicOrderId}&phone=${encodeURIComponent(order.customerPhone)}`;
  
  switch (status) {
    case "preparing":
      return `Hi ${order.customerName}, your Costra Coffee order #${order.publicOrderId} is now being prepared ☕! Track live: ${trackingUrl}`;
    case "ready":
      return `Hi ${order.customerName}, your Costra Coffee order #${order.publicOrderId} is ready 📦! Track live: ${trackingUrl}`;
    case "out_for_delivery":
      return `Hi ${order.customerName}, your Costra Coffee order #${order.publicOrderId} is out for delivery 🚴! Track live: ${trackingUrl}`;
    case "delivered":
      return `Hi ${order.customerName}, your Costra Coffee order #${order.publicOrderId} has been delivered. Thank you for ordering from Costra Coffee!`;
    case "cancelled":
      return `Hi ${order.customerName}, your Costra Coffee order #${order.publicOrderId} has been cancelled. Please contact support if you need help.`;
    default:
      return `Hi ${order.customerName}, your Costra Coffee order #${order.publicOrderId} status is now: ${status}. Track live: ${trackingUrl}`;
  }
}

/**
 * Generate WhatsApp Web/App click-to-send link
 */
export function getWhatsAppNotificationLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to dispatch SMS / WhatsApp via HTTP API if environment variables are set
 */
async function dispatchExternalNotification(recipient: string, message: string, orderId: string): Promise<void> {
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;

  // 1. Fast2SMS Provider Integration (India)
  if (fast2smsKey && recipient) {
    try {
      const cleanPhone = recipient.replace(/\D/g, "").slice(-10);
      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2smsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message: message,
          language: "english",
          numbers: cleanPhone,
        }),
      });
      console.log(`[Fast2SMS] Dispatched SMS to ${cleanPhone}`);
    } catch (err) {
      console.error("[Fast2SMS] Error sending SMS:", err);
    }
  }

  // 2. Generic Notification Webhook Provider
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          message,
          orderId,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log(`[NotificationWebhook] Dispatched webhook to ${webhookUrl}`);
    } catch (err) {
      console.error("[NotificationWebhook] Error sending webhook:", err);
    }
  }
}

/**
 * Extensible Notification Service Abstraction
 */
export class NotificationService {
  /**
   * Send order confirmation to Customer and Admin
   */
  static async sendOrderConfirmation(order: OrderRecord): Promise<boolean> {
    const key = `confirm_${order.publicOrderId}`;
    if (sentNotificationsMap.has(key)) {
      console.log(`[NotificationService] Duplicate confirmation skipped for order ${order.publicOrderId}`);
      return true;
    }

    const customerMsg = buildCustomerOrderConfirmationMsg(order);
    const adminMsg = buildAdminOrderNotificationMsg(order);

    console.log("=========================================");
    console.log("📱 [CUSTOMER NOTIFICATION DISPATCHED]");
    console.log(`To: ${order.customerPhone || order.customerEmail}`);
    console.log(customerMsg);
    console.log("-----------------------------------------");
    console.log("🔔 [COSTRA ADMIN NOTIFICATION DISPATCHED]");
    console.log(`To: +91 83603 22894 / +91 87340 82232`);
    console.log(adminMsg);
    console.log("=========================================");

    // Dispatch via external gateway if configured
    await dispatchExternalNotification(order.customerPhone, customerMsg, order.publicOrderId);

    // Store idempotency log
    sentNotificationsMap.set(key, {
      orderId: order.id,
      eventType: "order_confirmation",
      recipient: order.customerPhone,
      message: customerMsg,
      sentAt: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Send status update notification to Customer
   */
  static async sendStatusUpdate(order: OrderRecord, newStatus: OrderStatus): Promise<boolean> {
    const key = `status_${order.publicOrderId}_${newStatus}`;
    if (sentNotificationsMap.has(key)) {
      console.log(`[NotificationService] Duplicate status update skipped for ${key}`);
      return true;
    }

    const message = buildStatusUpdateMsg(order, newStatus);

    console.log("=========================================");
    console.log(`📱 [CUSTOMER STATUS UPDATE DISPATCHED: ${newStatus.toUpperCase()}]`);
    console.log(`To: ${order.customerPhone}`);
    console.log(message);
    console.log("=========================================");

    // Dispatch via external gateway if configured
    await dispatchExternalNotification(order.customerPhone, message, order.publicOrderId);

    sentNotificationsMap.set(key, {
      orderId: order.id,
      eventType: `status_${newStatus}`,
      recipient: order.customerPhone,
      message,
      sentAt: new Date().toISOString(),
    });

    return true;
  }
}
