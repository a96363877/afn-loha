import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "الصفحة الرئيسة",
  description: "الصفخة الرسمية",
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
