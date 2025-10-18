import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ClientSessionProvider } from "./context/sessionProvider";
import { Toaster } from "sonner";
import Link from "next/link"; // Import Link for navigation
import { Bot } from "lucide-react"; // Import the Bot icon

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Waruiru Farm",
  description: "Fresh Horticultural Produce", icons: '/favicon.ico'
};

// Client Component for the persistent button (requires "use client")
// We define it here because we need "use client" for the Link component if using Next.js 13+ App Router
const FarmDoctorFAB = () => {
  return (
    <Link
      href="/chat" // Adjust this to your diagnosis page path (e.g., /diagnosis or /bot)
      passHref
      className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl bg-green-100 text-green transition-transform duration-200 hover:scale-105 hover:bg-green-200 focus:outline-none transform-gpu"
      aria-label="Launch Farm Doctor AI Chat"
      title="Farm Doctor AI"
    >
      <Bot className="w-7 h-7" />
    </Link>
  );
};
// Add "use client" for components that need interactivity like Link
(FarmDoctorFAB as any).displayName = "FarmDoctorFAB";
(FarmDoctorFAB as any).client = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ClientSessionProvider>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
          <Toaster />

          {/* Include the persistent AI Doctor button */}
          <FarmDoctorFAB />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
