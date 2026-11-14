import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050E1A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PharmaOS - Next-Gen Pharmacy Management Enterprise Console",
  description: "Futuristic SaaS-grade operations console for independent pharmacy owners. Advanced inventory controls, smart run-rate forecasting, Point of Sale register, and automated invoice analytics.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050E1A] font-sans antialiased text-white">{children}</body>
    </html>
  );
}

