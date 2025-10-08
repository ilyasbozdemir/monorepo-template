import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { Beaker, Cloud, Database, Settings, Shield } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <header className="bg-gray-100 p-6 shadow">
            <h1 className="text-2xl font-bold mb-4">
              <Link
                href={"/"}
                className="text-gray-700 font-medium text-center"
              >
                APP_NAME
              </Link>
            </h1>
          </header>

          <main>{children}</main>
          <footer className="bg-gray-100 p-4 mt-12 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
          </footer>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
