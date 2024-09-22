"use client"
import type { Metadata } from "next";
import SkModernist from "@/utils/customFonts";
import "./globals.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";


const queryClient = new QueryClient();


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={SkModernist.className}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
