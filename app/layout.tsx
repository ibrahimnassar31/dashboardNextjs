import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "لوحة تحكم إدارة المشاريع",
  description: "نظام إدارة المشاريع والمهام",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col md:flex-row-reverse">
          <Sidebar />
          <div className="flex-1 w-full md:pr-64">
            <Header />
            <main className="p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
