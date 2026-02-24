import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PageSmith - AI-Powered Ebook Creator",
  description: "Create professional ebooks, lead magnets, and digital content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
