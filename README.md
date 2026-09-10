# ☕ COSTRA Coffee — E-Commerce Website

Official e-commerce website for **COSTRA Coffee** by **Swati Gruh Udhyog**. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Razorpay Payment Gateway integration.

---

## 🚀 Features

- **Artisanal Coffee Catalog**: Browse South Indian Filter Coffee blends, Arabica whole beans, and instant coffee.
- **Single Product Detail View**: High-resolution, consistent product gallery viewer with lightbox zoom.
- **Razorpay Payment Integration**: Integrated server-side order creation and HMAC-SHA256 signature verification.
- **Direct WhatsApp Orders**: Instant checkout via formatted WhatsApp order messaging (+91 83603 22894 / +91 87340 82232).
- **SEO & Schema Markup**: Dynamic metadata, OpenGraph cards, JSON-LD Schema.org (`Organization`, `LocalBusiness`, `Product`, `BreadcrumbList`), dynamic XML `sitemap.xml`, and `robots.txt`.
- **Responsive Mobile First UI**: Clean layout built with Tailwind CSS and Framer Motion animations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons & Animations**: Lucide React, Framer Motion
- **Payments**: Razorpay Node.js SDK
- **State Management**: Zustand

---

## 📦 Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Razorpay Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET

# Website Base URL
NEXT_PUBLIC_SITE_URL=https://costracoffee.com
```

---

## 🏃 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License & Ownership

Formulated by **Swati Gruh Udhyog** (FSSAI Lic. No: `20726032000830`). All rights reserved.
