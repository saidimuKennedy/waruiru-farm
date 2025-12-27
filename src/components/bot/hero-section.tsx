"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, AreaChart } from "lucide-react";
import { Problem } from "@/types/problems";

interface HeroSectionProps {
  problem: Problem | undefined;
}

const HeroSection: React.FC<HeroSectionProps> = ({ problem }) => {
  if (!problem) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={problem.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-white/30 to-emerald-100/50"></div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 0% 0%, #2e7d32 0%, transparent 50%)",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 -mt-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-3 text-green-900">
              {problem.title}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl text-green-900/80 mb-6 font-medium">
              <span className="font-bold text-2xl">Cause: </span>{" "}
              {problem.cause.join(" , ")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2 shadow-lg"
              >
                <Clock className="w-4 h-4 text-green-700" />
                <span className="text-green-700">
                  <span className="text-green-900/70 mr-1">Time to Fix:</span>
                  {problem.timeToFix}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2 shadow-lg"
              >
                <AreaChart className="w-4 h-4 text-green-700" />
                <span className="text-green-700">
                  <span className="text-green-900/70 mr-1">Difficulty:</span>
                  {problem.difficulty}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HeroSection;
