import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hava Buddy | Ofis & Duino-Coin Canlı Takip",
  description: "ESP32 destekli 7/24 ofis sıcaklık, nem ve Duino-Coin madencilik takip paneli.",
  metadataBase: new URL("https://hava-buddy.vercel.app"),
  openGraph: {
    title: "Hava Buddy | Ofis & Duino-Coin Canlı Takip",
    description: "ESP32 destekli 7/24 ofis sıcaklık, nem ve Duino-Coin madencilik takip paneli.",
    url: "https://hava-buddy.vercel.app",
    siteName: "Hava Buddy",
    images: [
      {
        url: "/icon.png", // Düzeltildi: /favicon.png yerine /icon.png yapıldı
        width: 512,
        height: 512,
        alt: "Hava Buddy Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hava Buddy | Ofis & Duino-Coin Canlı Takip",
    description: "ESP32 destekli 7/24 ofis sıcaklık, nem ve Duino-Coin madencilik takip paneli.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}