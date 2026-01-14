"use client";

import Link from "next/link";
import { Bot } from "lucide-react";

/**
 * Floating Action Button (FAB) to launch the Farm Doctor AI chat.
 * Fixed to the bottom-right corner of the screen.
 */
export default function FarmDoctorFAB() {
  return (
    <Link
      href="/chat"
      passHref
      className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl bg-green-100 text-green transition-transform duration-200 hover:scale-105 hover:bg-green-200 focus:outline-none transform-gpu"
      aria-label="Launch Farm Doctor AI Chat"
      title="Farm Doctor AI"
    >
      <Bot className="w-7 h-7" />
    </Link>
  );
}
