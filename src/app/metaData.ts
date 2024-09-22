import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vox AI",
  description: "Seamless voice assistant with instant responses.",
  metadataBase: new URL('https://your-website-url.com'), // Replace with your actual website URL
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Vox AI",
    description: "Vox AI",
    images: "/opengraph-image.png", // Update path if necessary
  },
  twitter: {
    card: "summary_large_image",
    images: "/opengraph-image.png", // Update path if necessary
    creator: "@YshTygi",
  },
};