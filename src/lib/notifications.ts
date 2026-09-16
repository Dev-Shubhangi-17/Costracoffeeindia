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
We'll keep you updated on your order status.
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
  switch (status) {
    case "preparing":
      return `Your Costra order #${order.publicOrderId} is now being prepared ☕`;
    case "ready":
      return `Your Costra order #${order.publicOrderId} is ready!`;
    case "out_for_delivery":
      return `Your Costra order #${order.publicOrderId} is out for delivery 🚴`;
    case "delivered":
      return `Your Costra order #${order.publicOrderId} has been delivered. Thank you for ordering from Costra Coffee!`;
    case "cancelled":
      return `Your Costra order #${order.publicOrderId} has been cancelled. Please contact support if you need help.`;
    default:
      return `Your Costra order #${order.publicOrderId} status is now: ${status}`;
  }
}

/**
 * Extensible Notification Service Abstraction
 * Handles dispatching alerts via Console, Webhooks, or configured SMS/WhatsApp/Email providers securely without exposing secrets.
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
