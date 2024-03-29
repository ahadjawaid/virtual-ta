import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virtual TA",
  description: "A service that assist students with questions about their classes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full bg-white" lang="en">
      <body className={`h-full ${inter.className}`}>{children}</body>
    </html>
  );
}
