import type { Metadata } from "next";
import { Archivo_Black, DM_Sans } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RetailBricks Learn",
  description: "Professional courses for retail operators",
  metadataBase: new URL("https://learn.retailbricks.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivoBlack.variable} ${dmSans.variable} font-sans bg-dark-base text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
