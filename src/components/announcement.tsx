"use client";

import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

/**
 * Displays a scrolling announcement bar at the top of the page.
 * Automatically hides after a set timeout (60 seconds).
 */
export default function Announcement() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);
  const textScrollVariants: Variants = {
    initial: { x: "100%" },
    animate: {
      x: "-100%",
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 45,
          ease: "linear",
        },
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-orange-100 border-b border-orange-300 text-orange-800 p-3 text-center text-sm md:text-base flex items-center overflow-hidden relative"
        >
          <Info className="w-5 h-5 flex-shrink-0 mr-2" />
          <div className="flex-grow overflow-hidden whitespace-nowrap">
            <motion.p
              variants={textScrollVariants}
              initial="initial"
              animate="animate"
              className="font-medium inline-block"
            >
              Please note: Sales services are temporarily unavailable this week.
              We anticipate resuming normal operations next week and appreciate
              your understanding.
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Please note:
              Sales services are temporarily unavailable this week. We
              anticipate resuming normal operations next week and appreciate
              your understanding.
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Please note:
              Sales services are temporarily unavailable this week. We
              anticipate resuming normal operations next week and appreciate
              your understanding.
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Please note:
              Sales services are temporarily unavailable this week. We
              anticipate resuming normal operations next week and appreciate
              your understanding.
              {/* Duplicated text to ensure continuous scroll effect */}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
