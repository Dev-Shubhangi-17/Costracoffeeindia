/**
 * COSTRA Coffee - Growth & E-Commerce Analytics Utility Module
 * Integrates Google Analytics 4 (GA4) and Meta Pixel (Facebook/Instagram Ads) event tracking triggers.
 */

// Custom types for globally attached analytics libraries on client-side
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    fbq?: (command: string, ...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Tracks SPA Route path navigation page views.
 */
export function trackPageView(url: string) {
  if (typeof window === "undefined") return;

  // 1. Google Analytics 4 pageview tracking
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  // 2. Meta Pixel pageview tracking
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
}

/**
 * Tracks a user viewing a product's detailed page.
 */
export function trackViewItem(product: {
  id: string;
  name: string;
  mrp: number;
  category: string;
}) {
  if (typeof window === "undefined") return;

  // GA4: view_item
  if (window.gtag) {
    window.gtag("event", "view_item", {
      currency: "INR",
      value: product.mrp,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.mrp,
          item_category: product.category,
          quantity: 1,
        },
      ],
    });
  }

  // Meta Pixel: ViewContent
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_type: "product",
      content_ids: [product.id],
      content_name: product.name,
      value: product.mrp,
      currency: "INR",
    });
  }
}

/**
 * Tracks cart additions or direct purchase clicks.
 */
export function trackAddToCart(
  product: {
    id: string;
    name: string;
    mrp: number;
    category?: string;
  },
  quantity = 1
) {
  if (typeof window === "undefined") return;

  const itemVal = product.mrp * quantity;

  // GA4: add_to_cart
  if (window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: "INR",
      value: itemVal,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.mrp,
          item_category: product.category || "Coffee Blends",
          quantity: quantity,
        },
      ],
    });
  }

  // Meta Pixel: AddToCart
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_type: "product",
      content_ids: [product.id],
      content_name: product.name,
      value: itemVal,
      currency: "INR",
    });
  }
}

/**
 * Tracks initiating secure checkout workflows.
 */
export function trackInitiateCheckout(
  cartItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  totalAmount: number
) {
  if (typeof window === "undefined") return;

  // GA4: begin_checkout
  if (window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: "INR",
      value: totalAmount,
      items: cartItems.map((item) => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  // Meta Pixel: InitiateCheckout
  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_type: "product",
      content_ids: cartItems.map((item) => item.productId),
      value: totalAmount,
      currency: "INR",
    });
  }
}

/**
 * Tracks successful order completions (COD, Razorpay, or WhatsApp checkout).
 */
export function trackPurchase(
  transactionId: string,
  cartItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  totalAmount: number
) {
  if (typeof window === "undefined") return;

  // GA4: purchase
  if (window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      currency: "INR",
      value: totalAmount,
      items: cartItems.map((item) => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  // Meta Pixel: Purchase
  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_type: "product",
      content_ids: cartItems.map((item) => item.productId),
      value: totalAmount,
      currency: "INR",
    });
  }
}
