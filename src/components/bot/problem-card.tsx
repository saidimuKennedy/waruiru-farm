"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock,
  AreaChart,
} from "lucide-react";
import Image from "next/image";
import { Problem } from "@/types/problems";
import { getProblemIcon} from "@/lib/farm-doctor-utils";

interface ProblemCardProps {
  problem: Problem;
  index: number;
  activeCard: string | null;
  setActiveCard: (id: string | null) => void;
}

/**
 * Displays a single agricultural problem card with details.
 * Expandable to show likely causes, immediate actions, and prevention.
 *
 * @param {Problem} problem - The problem data.
 * @param {number} index - Index for animation delay.
 * @param {string | null} activeCard - ID of the currently expanded card.
 * @param {function} setActiveCard - Function to toggle card expansion.
 */
const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  index,
  activeCard,
  setActiveCard,
}) => {
  const ProblemIcon = getProblemIcon(problem.category, problem.severity);
  const isOpen = activeCard === problem.id;

  return (
    <motion.div
      key={problem.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  h-full flex flex-col`}
    >
      <div className="flex flex-col flex-grow">
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <Image
            src={problem.image}
            alt={problem.title}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-black opacity-70`}></div>

          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-800/20"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between mb-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold text-green-300 bg-white/95`}
              >
                {problem.severity.toUpperCase()} PRIORITY
              </div>
              <div className="text-2xl text-white bg-green-700/80 backdrop-blur-sm rounded-lg p-2 border-white/50">
                <ProblemIcon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl text-white font-bold mb-2 drop-shadow-lg">
              {problem.title}
            </h3>
            <div className="flex items-center gap-4 text-sm opacity-95 drop-shadow-md">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-green-300" />
                {problem.timeToFix}
              </span>
              <span className="flex items-center gap-1">
                <AreaChart className="w-4 h-4 text-green-300" />
                {problem.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={() =>
              setActiveCard(activeCard === problem.id ? null : problem.id)
            }
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="font-semibold text-green-800 group-hover:text-green-600 transition-colors">
              View Diagnosis & Treatment
            </span>
            {activeCard === problem.id ? (
              <ChevronUp className="w-5 h-5 text-green-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-green-600 group-hover:text-green-700" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeCard === problem.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-0 space-y-6 p-6 pt-0"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 border-2 rounded-xl border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Likely Causes
              </h4>
              <ul className="space-y-2">
                {Array.isArray(problem.cause) &&
                  problem.cause.map((cause, idx) => (
                    <li
                      key={idx}
                      className="text-green-700 text-sm flex items-start gap-2"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      {cause}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 border-2 border-teal-200 rounded-xl">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Immediate Actions
              </h4>
              <ul className="space-y-2">
                {Array.isArray(problem.action) &&
                  problem.action.map((action, idx) => (
                    <li
                      key={idx}
                      className="text-teal-700 text-sm flex items-start gap-2"
                    >
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                      {action}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 border-2 border-emerald-200 rounded-xl">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Prevention & Follow-up
              </h4>
              <ul className="space-y-2">
                {Array.isArray(problem.followUp) &&
                  problem.followUp.map((followUp, idx) => (
                    <li
                      key={idx}
                      className="text-emerald-700 text-sm flex items-start gap-2"
                    >
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      {followUp}
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProblemCard;
