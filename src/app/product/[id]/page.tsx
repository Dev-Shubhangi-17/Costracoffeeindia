import React from "react";
import { Metadata } from "next";
import { mockProducts } from "@/data/mockProducts";
import ProductDetailClient from "@/components/pdp/ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = mockProducts.find((p) => p.id === params.id) || mockProducts[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://costracoffee.com";
  const pageUrl = `${siteUrl}/product/${product.id}`;

  return {
    title: `${product.name} (${product.netWeight}) | COSTRA Coffee`,
    description: `${product.description} Ingredients: ${product.ingredients}. FSSAI Licensed: 20726032000830 by Swati Gruh Udhyog.`,
    keywords: [
      product.name,
      product.category,
      product.ingredients,
      "COSTRA Coffee",
      "Swati Gruh Udhyog",
      "Filter Coffee India",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${product.name} | COSTRA Coffee`,
      description: product.description,
      url: pageUrl,
      siteName: "COSTRA Coffee",
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: `${product.name} - COSTRA Coffee`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | COSTRA Coffee`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id) || mockProducts[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://costracoffee.com";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `${siteUrl}${product.image}`,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "COSTRA Coffee"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.mrp,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Swati Gruh Udhyog"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewsCount
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${siteUrl}/#shop-catalog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${siteUrl}/product/${product.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient productId={params.id} />
    </>
  );
}
