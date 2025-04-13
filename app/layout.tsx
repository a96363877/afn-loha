import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "الصفحة الرئيسة",
  description: "الصفخة الرسمية",viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
