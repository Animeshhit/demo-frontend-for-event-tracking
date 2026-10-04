import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import AuthProvider from "@/providers/auth.provider";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "A simple e-commerce application built with Next.js",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f6f1",
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${geist.className}`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
