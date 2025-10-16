"use client";
import { Leaf, X, Menu, Route, User, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Diagnosis", href: "/bot" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const AuthButton = () => {
    if (status === "loading") {
      return (
        <Button
          className="bg-gray-400 text-white rounded-full px-6 py-3 shadow-lg cursor-not-allowed"
          disabled
        >
          Loading...
        </Button>
      );
    }

    if (session) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center ">
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 shadow-lg transition-transform transform hover:scale-105 flex items-center space-x-2"
        onClick={() => router.push("/auth/login")}
      >
        <span>Sign In</span>
      </Button>
    );
  };

  const MobileAuthButton = () => {
    if (status === "loading") {
      return (
        <Button
          className="w-full bg-gray-400 text-white rounded-full py-3 shadow-lg cursor-not-allowed"
          disabled
        >
          Loading...
        </Button>
      );
    }

    if (session) {
      return (
        <div className="space-y-3">
          <div className="px-4 py-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              Welcome, {session.user?.name || "User"}!
            </p>
          </div>

          <Button
            className="w-full bg-red-200 shadow-red-100 border-red-500 text-red-600 hover:bg-red-50 rounded-full py-3"
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
          >
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-3 shadow-lg"
        onClick={() => {
          router.push("/auth/login");
          setIsMenuOpen(false);
        }}
      >
        Sign In
      </Button>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between px-4 w-full min-h-[70px]">
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center flex-shrink-0"
          >
            <Link href="/">
              <Image
                src="/waruiru&logo.png"
                width={80}
                height={80}
                alt="Waruiru Farm Logo"
                className="sm:w-[100px] sm:h-[100px]"
              />
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-gray-600 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Button
              className="rounded-full px-4 py-2 bg-green-60 border border-green-500 text-green-600 hover:bg-green-50 transition-colors whitespace-nowrap"
              onClick={() => router.push("/quote")}
            >
              Get Quote
            </Button>
            <AuthButton />
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600 p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100">
          <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-70px)] overflow-y-auto">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="block text-lg text-gray-700 hover:text-green-600 transition-colors font-semibold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 rounded-full py-3"
                onClick={() => {
                  router.push("/quote");
                  setIsMenuOpen(false);
                }}
              >
                Get Quote
              </Button>
              <MobileAuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
