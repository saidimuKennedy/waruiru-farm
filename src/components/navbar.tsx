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
        onClick={() => router.push("/login")}
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
          router.push("/login");
          setIsMenuOpen(false);
        }}
      >
        Sign In
      </Button>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-11xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between px-4 md:px-10 w-full">
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center space-x-3"
          >
            <Link href="/">
              <Image
                src="/waruiru&logo.png"
                width={100}
                height={100}
                alt="Waruiru Farm Logo"
              />
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="rounded-full px-4 py-2  bg-green-60 border  border-green-500 text-green-600 hover:bg-green-50 transition-colors"
              onClick={() => router.push("/quote")}
            >
              Get Quote
            </Button>
            <AuthButton />
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-xl">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="block text-lg text-gray-700 hover:text-green-600 transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full mb-3 border-green-500 text-green-600 hover:bg-green-50 rounded-full py-3"
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
