export const metadata = {
  title: "AI Chat",
  description: "Image/PDF analyzer",
};

import "./globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";

const appFontTitle = localFont({
  src: "../assets/W95FA.otf",
  display: "swap",
  variable: "--font-title",
});
const appFontText = localFont({
  src: "../assets/micross.ttf",
  display: "swap",
  variable: "--font-text",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${appFontTitle.variable} ${appFontText.variable}`}>
      <body className={`h-screen w-screen bg-white text-gray-900 font-text`}>{children}</body>
    </html>
  );
}


