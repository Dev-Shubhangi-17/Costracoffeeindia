import { getSupabaseServerClient } from "./supabaseServer";

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "order_placed"
  | "payment_confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  publicOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory persistent store fallback for environments where Supabase is not yet configured
const inMemoryOrdersMap = new Map<string, OrderRecord>();

/**
 * Generate a clean, readable Public Order ID (e.g. COSTRA1024)
 */
export function generatePublicOrderId(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(100 + Math.random() * 900);
  return `COSTRA${timestamp}${random}`;
}

/**
 * Create a new order record in database or fallback store
 */
export async function createOrderRecord(
  orderData: Omit<OrderRecord, "id" | "publicOrderId" | "createdAt" | "updatedAt" | "paymentStatus" | "orderStatus"> & {
    publicOrderId?: string;
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
  }
): Promise<OrderRecord> {
  const now = new Date().toISOString();
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const publicOrderId = orderData.publicOrderId || generatePublicOrderId();
  
  const record: OrderRecord = {
    id,
    publicOrderId,
    customerName: orderData.customerName || "Valued Customer",
    customerEmail: orderData.customerEmail || "",
    customerPhone: orderData.customerPhone || "",
    items: orderData.items || [],
    subtotal: orderData.subtotal || orderData.totalAmount || 0,
    deliveryFee: orderData.deliveryFee || 0,
    totalAmount: orderData.totalAmount || 0,
    currency: orderData.currency || "INR",
    paymentStatus: orderData.paymentStatus || "pending",
    orderStatus: orderData.orderStatus || "order_placed",
    razorpayOrderId: orderData.razorpayOrderId || "",
    razorpayPaymentId: orderData.razorpayPaymentId || "",
    shippingAddress: orderData.shippingAddress || "",
    createdAt: now,
    updatedAt: now,
  };

  // 1. Try Supabase
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          public_order_id: record.publicOrderId,
          customer_name: record.customerName,
          customer_email: record.customerEmail,
          customer_phone: record.customerPhone,
          items: record.items,
          subtotal: record.subtotal,
          delivery_fee: record.deliveryFee,
          total_amount: record.totalAmount,
          currency: record.currency,
          payment_status: record.paymentStatus,
          order_status: record.orderStatus,
          razorpay_order_id: record.razorpayOrderId,
          razorpay_payment_id: record.razorpayPaymentId,
          shipping_address: record.shippingAddress,
          created_at: record.createdAt,
          updated_at: record.updatedAt,
        })
        .select()
        .single();

      if (!error && data) {
        record.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase insert warning, falling back to memory store:", err);
    }
  }

  // 2. Always maintain fallback store
  inMemoryOrdersMap.set(record.publicOrderId, record);
  inMemoryOrdersMap.set(record.id, record);
  if (record.razorpayOrderId) {
    inMemoryOrdersMap.set(record.razorpayOrderId, record);
  }

  return record;
}

/**
 * Find an order by publicOrderId, razorpayOrderId, or id
 */
export async function getOrderById(idOrPublicId: string): Promise<OrderRecord | null> {
  const cleanId = idOrPublicId.trim();

  // 1. Check Supabase
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`public_order_id.eq.${cleanId},razorpay_order_id.eq.${cleanId},id.eq.${cleanId}`)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          publicOrderId: data.public_order_id,
          customerName: data.customer_name,
          customerEmail: data.customer_email || "",
          customerPhone: data.customer_phone,
          items: data.items || [],
          subtotal: Number(data.subtotal),
          deliveryFee: Number(data.delivery_fee),
          totalAmount: Number(data.total_amount),
          currency: data.currency,
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          razorpayOrderId: data.razorpay_order_id || "",
          razorpayPaymentId: data.razorpay_payment_id || "",
          shippingAddress: data.shipping_address || "",
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn("Supabase lookup warning:", err);
    }
  }

  // 2. Fallback store lookup
  return inMemoryOrdersMap.get(cleanId) || null;
}

/**
 * Update an order status or payment status
 */
export async function updateOrderRecord(
  idOrPublicId: string,
  updates: {
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
    razorpayPaymentId?: string;
  }
): Promise<OrderRecord | null> {
  const existing = await getOrderById(idOrPublicId);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updatedRecord: OrderRecord = {
    ...existing,
    ...(updates.paymentStatus ? { paymentStatus: updates.paymentStatus } : {}),
    ...(updates.orderStatus ? { orderStatus: updates.orderStatus } : {}),
    ...(updates.razorpayPaymentId ? { razorpayPaymentId: updates.razorpayPaymentId } : {}),
    updatedAt: now,
  };

  // 1. Update Supabase
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase
        .from("orders")
        .update({
          payment_status: updatedRecord.paymentStatus,
          order_status: updatedRecord.orderStatus,
          razorpay_payment_id: updatedRecord.razorpayPaymentId,
          updated_at: updatedRecord.updatedAt,
        })
        .or(`public_order_id.eq.${existing.publicOrderId},id.eq.${existing.id}`);

      // Log status change
      if (updates.orderStatus && updates.orderStatus !== existing.orderStatus) {
        await supabase.from("order_status_logs").insert({
          order_id: existing.id,
          previous_status: existing.orderStatus,
          new_status: updates.orderStatus,
          changed_by: "system_or_admin",
        });
      }
    } catch (err) {
      console.warn("Supabase update warning:", err);
    }
  }

  // 2. Update memory store
  inMemoryOrdersMap.set(existing.publicOrderId, updatedRecord);
  inMemoryOrdersMap.set(existing.id, updatedRecord);
  if (existing.razorpayOrderId) {
    inMemoryOrdersMap.set(existing.razorpayOrderId, updatedRecord);
  }

  return updatedRecord;
}

/**
 * Fetch all orders for Costra Admin Management
 */
export async function getAllOrders(): Promise<OrderRecord[]> {
  // 1. Try Supabase
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          publicOrderId: d.public_order_id,
          customerName: d.customer_name,
          customerEmail: d.customer_email || "",
          customerPhone: d.customer_phone,
          items: d.items || [],
          subtotal: Number(d.subtotal),
          deliveryFee: Number(d.delivery_fee),
          totalAmount: Number(d.total_amount),
          currency: d.currency,
          paymentStatus: d.payment_status,
          orderStatus: d.order_status,
          razorpayOrderId: d.razorpay_order_id || "",
          razorpayPaymentId: d.razorpay_payment_id || "",
          shippingAddress: d.shipping_address || "",
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getAllOrders warning:", err);
    }
  }

  // 2. Return unique orders from fallback store
  const uniqueMap = new Map<string, OrderRecord>();
  inMemoryOrdersMap.forEach((val) => {
    uniqueMap.set(val.publicOrderId, val);
  });
  return Array.from(uniqueMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
