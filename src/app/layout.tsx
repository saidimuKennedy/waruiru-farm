import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ClientSessionProvider } from "./context/sessionProvider";
import { Toaster } from "sonner";
import FarmDoctorFAB from "@/components/farm-doctor-FAB"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Waruiru Farm",
  description: "Fresh Horticultural Produce",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <FarmDoctorFAB />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
