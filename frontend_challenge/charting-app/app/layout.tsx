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
  title: "Ad Metrics Charting Tool",
  description: "Visualize and analyze Meta and TikTok ad metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto py-4 px-4">
              <h1 className="text-xl font-bold">Ad Metrics Charting Tool</h1>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Ad Metrics Charting Tool - Built with Next.js and shadcn/ui
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
