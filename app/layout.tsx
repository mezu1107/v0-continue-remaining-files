import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { AuthProvider } from "@/lib/auth-context";   // apna correct path
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

/* -----------------------------
   Google Fonts
----------------------------- */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

/* -----------------------------
   SEO Keywords
----------------------------- */

const keywords = [
  // Islamabad & Rawalpindi Keywords
  "web design Islamabad",
  "digital marketing agency Islamabad",
  "SEO services Islamabad",
  "web development Rawalpindi",
  "digital marketing Rawalpindi",
  "branding agency Islamabad",
  "e-commerce solutions Rawalpindi",
  "software development Islamabad",
  "graphic design services Rawalpindi",
  
  // UK Keywords
  "web design UK",
  "digital marketing agency UK",
  "SEO services UK",
  "web development London",
  "UK digital solutions",
  
  // Pakistan Regional
  "digital solutions Pakistan",
  "web design Pakistan",
  "digital marketing Pakistan",
  "best SEO services Pakistan",
  "web development company Pakistan",
  "branding agency Pakistan",
  "e-commerce web development Pakistan",
  
  // International Keywords
  "enterprise digital solutions",
  "global web development company",
  "international SEO services",
  "CRM software solutions",
  "digital transformation services",
  "multi-channel marketing platform",
]

/* -----------------------------
   Metadata (SEO)
----------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://amenterprises.tech"),

  title: {
    default: "AM Enterprises | Digital Solutions for Islamabad, Rawalpindi & UK",
    template: "%s | AM Enterprises",
  },

  description:
    "AM Enterprises is a top digital solutions provider serving Islamabad, Rawalpindi, and UK. We offer expert Web Design, SEO, Digital Marketing, Branding, E-commerce, CRM, and Enterprise Software solutions.",

  keywords,

  authors: [
    {
      name: "AM Enterprises",
      url: "https://amenterprises.tech",
    },
  ],

  creator: "AM Enterprises",
  publisher: "AM Enterprises",

  alternates: {
    canonical: "https://amenterprises.tech",
  },

  verification: {
    google: "google-site-verification-code", // Add your actual Google verification code
  },

  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },

  openGraph: {
    title: "AM Enterprises | Digital Solutions & Web Design for Pakistan & UK",
    description:
      "Professional digital solutions for businesses in Islamabad, Rawalpindi, and UK. Web Design, SEO, Digital Marketing, E-commerce, and Enterprise Software.",
    url: "https://amenterprises.tech",
    siteName: "AM Enterprises",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "AM Enterprises Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AM Enterprises | Digital Solutions & Web Design",
    description:
      "Top digital solutions provider for Islamabad, Rawalpindi, UK. Web Design, SEO, Digital Marketing, E-commerce, and more.",
    images: ["/assets/logo.png"],
    creator: "@amenterprises",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#6366f1",
  },
}

/* -----------------------------
   Root Layout
----------------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <AuthProvider>          {/* ← This now works because AuthProvider is "use client" */}
          {children}
          <Toaster position="top-right" />
          <Analytics />
        </AuthProvider>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AM Enterprises",
              url: "https://amenterprises.tech",
              logo: "https://amenterprises.tech/assets/logo.png",
              sameAs: [
                "https://www.facebook.com/AMEnterprises",
                "https://www.linkedin.com/company/amenterprises",
                "https://twitter.com/AMEnterprises",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+92-317-3712950",
                  contactType: "customer service",
                  areaServed: "PK",
                  availableLanguage: ["English", "Urdu"],
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
