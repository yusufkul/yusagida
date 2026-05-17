import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Depo Yönetim Sistemi",
  description: "Palet bazlı stok takibi, sipariş ve müşteri borç yönetimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
