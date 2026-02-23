import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "@/lib/auth/amplify-config";

export const metadata: Metadata = {
  title: "EcoBid - Give & Receive Free Items",
  description: "Mobile-first marketplace for giving away items you don't need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <Navigation />
          <main className="pb-16 sm:pb-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
