import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const satoshiFont = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--satoshi",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshiFont.variable} antialiased dark:bg-trekn-main`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}