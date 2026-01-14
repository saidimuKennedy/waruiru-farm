"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ClientNavigationProps {
  prevPostSlug: string | null;
  nextPostSlug: string | null;
}

/**
 * Navigation component for blog posts.
 * Provides floating "Previous" and "Next" buttons to navigate between blog posts.
 * Uses Framer Motion for animations.
 *
 * @param {string | null} prevPostSlug - Slug of the previous post.
 * @param {string | null} nextPostSlug - Slug of the next post.
 */
export default function ClientNavigation({
  prevPostSlug,
  nextPostSlug,
}: ClientNavigationProps) {
  return (
    <>
      {prevPostSlug && (
        <Link
          href={`/blog/${prevPostSlug}`}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50 group"
          aria-label="Previous blog post"
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            {/* Glowing Ring */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full opacity-60 blur-sm"
              animate={{
                rotate: [0, 360],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />

            {/* Main Button */}
            <motion.div
              className="relative bg-green-600 rounded-full p-4 text-white shadow-xl  backdrop-blur-sm"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgb(22, 163, 74)",
                color: "white",
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.95,
              }}
              animate={{
                x: [-2, 2, -2],
              }}
              transition={{
                x: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="relative">
                <ChevronLeft
                  size={24}
                  className="group-hover:-translate-x-1 transition-transform duration-200"
                />

                {/* Tooltip */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-green-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                    {" "}
                    Previous Post
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-green-800"></div>{" "}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Link>
      )}

      {nextPostSlug && (
        <Link
          href={`/blog/${nextPostSlug}`}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 group"
          aria-label="Next blog post"
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            {/* Glowing Ring */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-l from-green-400 via-emerald-500 to-green-600 rounded-full opacity-60 blur-sm"
              animate={{
                rotate: [0, -360],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
            />

            {/* Main Button */}
            <motion.div
              className="relative bg-green-600 rounded-full p-4 text-white shadow-xl  backdrop-blur-sm"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgb(22, 163, 74)",
                color: "white",
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.95,
              }}
              animate={{
                x: [2, -2, 2],
              }}
              transition={{
                x: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="relative">
                <ChevronRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />

                {/* Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-green-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                    {" "}
                    Next Post
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-green-800"></div>{" "}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Link>
      )}
    </>
  );
}
