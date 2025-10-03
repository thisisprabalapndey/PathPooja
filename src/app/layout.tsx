
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import AuthProvider from "../components/providers/AuthProvider";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import CartSidebar from "../components/cart/CartSidebar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PoojaPath - Sacred Items & Spiritual Essentials | Made for Devotees ",
  description: "India's most trusted spiritual ecommerce platform. Shop authentic Pooja items, mata ki chunri, holy books, chandan, havan materials, diyas, and more sacred products with fast delivery across India.",
  keywords: "pooja items, spiritual products, hindu religious items, havan materials, chandan, mata ki chunri, holy books, temples, prayer items, diyas, incense, rudraksha, spiritual shopping, devotional items, puja accessories, sacred products, religious books, spiritual gifts, temple items, festival items, navratri items, diwali items, karwa chauth, hindu festivals, spiritual ecommerce, devotee shopping",
  authors: [{ name: "PoojaPath Team" }],
  creator: "PoojaPath",
  publisher: "PoojaPath",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PoojaPath - Sacred Items & Spiritual Essentials",
    description: "India's most trusted spiritual ecommerce platform for authentic pooja items and sacred products",
    siteName: 'PoojaPath',
    images: [
      {
        url: '/og-image-spiritual.jpg',
        width: 1200,
        height: 630,
        alt: 'PoojaPath - Sacred Shopping for Devotees',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoojaPath - Sacred Items & Spiritual Essentials',
    description: "India's most trusted spiritual ecommerce platform for devotees",
    images: ['/twitter-image-spiritual.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'theme-color': '#f97316', // Saffron theme color
    'apple-mobile-web-app-title': 'PoojaPath',
    'application-name': 'PoojaPath',
    'msapplication-TileColor': '#f97316',
    'msapplication-config': '/browserconfig.xml',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon-spiritual.ico',
    shortcut: '/favicon-spiritual.ico',
    apple: '/apple-touch-icon-spiritual.png',
  },
  category: 'shopping',
  classification: 'Spiritual & Religious Products',
  referrer: 'origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Spiritual theme favicon and icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon-spiritual.svg" />
        <link rel="icon" type="image/png" href="/favicon-spiritual.png" />
        
        {/* Preload spiritual fonts if needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Schema.org markup for spiritual/religious business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              "name": "PoojaPath",
              "description": "India's most trusted spiritual ecommerce platform for authentic pooja items and sacred products",
              "url": "https://poojapath.com",
              "logo": "https://poojapath.com/logo-spiritual.png",
              "image": "https://poojapath.com/og-image-spiritual.jpg",
              "priceRange": "₹10 - ₹10000",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "India"
              },
              "sameAs": [
                "https://www.facebook.com/poojapath",
                "https://www.instagram.com/poojapath",
                "https://twitter.com/poojapath"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Spiritual & Religious Items",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Pooja Items",
                      "description": "Complete range of authentic pooja and prayer items"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Holy Books",
                      "description": "Sacred texts and spiritual literature"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Havan Materials",
                      "description": "Pure havan samagri and fire ritual items"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-orange-50/30 via-white to-red-50/30`}>
        {/* Spiritual background pattern (optional) */}
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <AuthProvider>
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
          <CartSidebar />
        </AuthProvider>

        {/* Spiritual blessing message (hidden, for SEO) */}
        <div className="sr-only">
          Om Namah Shivaya | Har Har Mahadev | Jay Mata Di | Spiritual shopping made easy for devotees across India
        </div>
      </body>
    </html>
  );
}

