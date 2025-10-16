"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Droplets,
  Sun,
  Leaf,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  // Import additional Lucide icons for problem visualization
  Bug, // For disease/pests
  HelpCircle, // Fallback/Default
  Zap, // For high severity/critical issues
  Sprout,
  Clock, // Used for time to fix
  AreaChart,
  BotIcon, // Renamed from LucideChartSpline for simplicity and correct import
} from "lucide-react";

// The Problem interface and categories array remain the same
interface Problem {
  id: string;
  title: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  image: string;
  emoji: string; // Keeping this field, but we won't use it for rendering
  gradient: string;
  cause: string[];
  followUp: string[];
  timeToFix: string;
  difficulty: string;
  action: string[];
}

const categories = [
  { id: "all", name: "All Problems", icon: Filter },
  { id: "watering", name: "Watering Issues", icon: Droplets },
  { id: "nutrients", name: "Nutrients", icon: Leaf },
  { id: "soil", name: "Soil Health", icon: Sun },
  { id: "disease", name: "Disease", icon: AlertTriangle },
];

// Mock data for demonstration
const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Leaf Yellowing",
    category: "nutrients",
    severity: "HIGH",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
    emoji: "🍂",
    gradient: "from-yellow-600/80 to-green-800/80",
    cause: ["Nitrogen deficiency", "Overwatering", "Root damage"],
    followUp: ["Monitor soil pH weekly", "Apply balanced fertilizer"],
    timeToFix: "1-2 weeks",
    difficulty: "Medium",
    action: [
      "Test soil nutrients",
      "Adjust watering schedule",
      "Apply nitrogen-rich fertilizer",
    ],
  },
  {
    id: "2",
    title: "Wilting Plants",
    category: "watering",
    severity: "MEDIUM",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
    emoji: "💧",
    gradient: "from-blue-600/80 to-green-700/80",
    cause: ["Underwatering", "Heat stress", "Root rot"],
    followUp: ["Check soil moisture daily", "Mulch around plants"],
    timeToFix: "3-5 days",
    difficulty: "Easy",
    action: ["Water deeply", "Provide shade", "Check drainage"],
  },
  {
    id: "3",
    title: "Pest Infestation",
    category: "disease",
    severity: "HIGH",
    image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800",
    emoji: "🐛",
    gradient: "from-red-600/80 to-orange-700/80",
    cause: ["Aphids", "Poor plant health", "Lack of beneficial insects"],
    followUp: ["Inspect plants weekly", "Maintain plant health"],
    timeToFix: "1 week",
    difficulty: "Hard",
    action: [
      "Apply organic pesticide",
      "Remove affected leaves",
      "Introduce beneficial insects",
    ],
  },
];

// Function to map problem category to a Lucide Icon Component
const getProblemIcon = (category: string, severity: string) => {
  if (severity === "HIGH") return Zap;

  switch (category) {
    case "watering":
      return Droplets;
    case "nutrients":
      return Sprout;
    case "soil":
      return Sun;
    case "disease":
      return Bug;
    default:
      return HelpCircle;
  }
};

const FarmDoctor = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [farmProblems] = useState<Problem[]>(mockProblems);
  const [loading] = useState(false);
  const [currentHeroProblemIndex, setCurrentHeroProblemIndex] = useState(0);

  const highSeverityProblems = farmProblems.filter(
    (p) => p.severity === "HIGH"
  );

  useEffect(() => {
    if (highSeverityProblems.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroProblemIndex(
          (prevIndex) => (prevIndex + 1) % highSeverityProblems.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [highSeverityProblems.length]);

  const currentHeroProblem = highSeverityProblems[currentHeroProblemIndex];

  const filteredProblems = farmProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(problem.cause) &&
        problem.cause.some((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesCategory =
      selectedCategory === "all" || problem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      case "medium":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "high":
        return "bg-teal-50 text-teal-800 border-teal-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Enhanced Quarter Ripple Effects - Multiple Corners */}
      <svg
        className="absolute top-0 left-0 w-96 h-96 z-0 pointer-events-none opacity-40"
        viewBox="0 0 200 200"
      >
        <defs>
          <clipPath id="quarter-tl">
            <rect x="0" y="0" width="100" height="100" />
          </clipPath>
        </defs>
        <g clipPath="url(#quarter-tl)">
          <circle
            cx="0"
            cy="0"
            r="100"
            fill="#c8e6c9"
            className="animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <circle cx="0" cy="0" r="70" fill="#81c784" />
          <circle cx="0" cy="0" r="40" fill="#2e7d32" />
          <circle cx="0" cy="0" r="20" fill="#1b5e20" />
        </g>
      </svg>

      {/* Bottom Right Ripple */}
      <svg
        className="absolute bottom-0 right-0 w-80 h-80 z-0 pointer-events-none opacity-30"
        viewBox="0 0 200 200"
      >
        <defs>
          <clipPath id="quarter-br">
            <rect x="100" y="100" width="100" height="100" />
          </clipPath>
        </defs>
        <g clipPath="url(#quarter-br)">
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="#a5d6a7"
            className="animate-pulse"
            style={{ animationDuration: "5s" }}
          />
          <circle cx="200" cy="200" r="70" fill="#66bb6a" />
          <circle cx="200" cy="200" r="40" fill="#388e3c" />
        </g>
      </svg>

      {/* Floating Green Circles */}
      <div
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "7s", animationDelay: "1s" }}
      ></div>

      {/* Animated Hero Section - Waruiru Farm Success Stories */}
      <AnimatePresence mode="wait">
        {currentHeroProblem && (
          <motion.div
            key={currentHeroProblem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
          >
            {/* Gradient Overlay Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-white/30 to-emerald-100/50"></div>

            {/* Ripple Pattern Background */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 0% 0%, #2e7d32 0%, transparent 50%)",
                }}
              ></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 -mt-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-3 text-green-900">
                  {currentHeroProblem.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl text-green-900/80 mb-6 font-medium">
                  <span className="font-bold text-2xl">Tell tale signs: </span>{" "}
                  {currentHeroProblem.cause.join(" , ")}
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
                      {/* FIX 1: Add the explicit label for time */}
                      <span className="text-green-900/70 mr-1">
                        Time to Fix:
                      </span>
                      {currentHeroProblem.timeToFix}
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
                      {/* FIX 2: Add the explicit label for difficulty */}
                      <span className="text-green-900/70 mr-1">
                        Difficulty:
                      </span>
                      {currentHeroProblem.difficulty}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual hero section  */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 -mt-16">
        {/* Header */}
        <div className="text-center my-12 pt-16">
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Waruiru Farm Doctor
          </h2>
          <p className="text-xl text-green-800/70 max-w-2xl mx-auto leading-relaxed">
            AI-powered farm diagnostics for rapid problem identification and
            treatment. From symptom to solution in minutes.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="backdrop-blur-sm rounded-3xl bg-green-50 p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
              <input
                type="text"
                placeholder="Search symptoms, causes, or solutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 shadow-xl rounded-xl bg-white text-gray-800 placeholder-green-600/50 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-xl ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg border-green-700"
                        : "bg-white text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
                    }`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Problem Cards - Fix applied here with h-full and flex-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProblems.map((problem, index) => {
            const ProblemIcon = getProblemIcon(
              problem.category,
              problem.severity
            );

            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                // === FIX: Use h-full and flex flex-col to enforce consistent height ===
                className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden 
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                h-full flex flex-col`}
              >
                {/* Content Wrapper to ensure static parts are grouped */}
                <div className="flex flex-col flex-grow">
                  {/* Card Header with Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={problem.image}
                      alt={problem.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${problem.gradient} opacity-70`}
                    ></div>

                    {/* Green Ripple Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-800/20"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getSeverityColor(
                            problem.severity
                          )} bg-white/95`}
                        >
                          {problem.severity.toUpperCase()} PRIORITY
                        </div>
                        {/* Rendering the Lucide Icon */}
                        <div className="text-2xl text-white bg-green-700/80 backdrop-blur-sm rounded-lg p-2 border-2 border-white/50">
                          <ProblemIcon className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 drop-shadow-lg">
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

                  {/* Card Content & Accordion Toggle */}
                  <div className="p-6">
                    <button
                      onClick={() =>
                        setActiveCard(
                          activeCard === problem.id ? null : problem.id
                        )
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

                {/* 2. Accordion Content (Must be outside the flex-grow wrapper for consistent height) */}
                <AnimatePresence>
                  {activeCard === problem.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-0 space-y-6 p-6 pt-0" // Removed top margin, added padding
                    >
                      {/* Causes */}
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

                      {/* Actions */}
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

                      {/* Follow-up */}
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
          })}
        </div>

        {/* --- ALERT CARD: No Results Found (Triangle Icon Container) --- */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="relative max-w-2xl mx-auto">
              {/* Large Triangle Icon as Background */}
              <div className="relative drop-shadow-2xl">
                {/* Triangle SVG Background with enhanced shadows */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-auto"
                  style={{
                    filter: "drop-shadow(0 20px 50px rgba(34, 197, 94, 0.25)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  <defs>
                    <linearGradient
                      id="triangleGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#ffffff", stopOpacity: 1 }}
                      />
                      <stop
                        offset="50%"
                        style={{ stopColor: "#f0fdf4", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#dcfce7", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    fill="url(#triangleGradient)"
                    stroke="#16a34a"
                    strokeWidth="0.1"
                    strokeOpacity="0.3"
                  />
                </svg>

                {/* Content Overlay - Positioned absolutely over the triangle */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center px-12 py-16"
                  style={{
                    top: "10%", // Adjust vertical position
                    height: "80%", // Use 80% of triangle height
                  }}
                >
                  {/* Small decorative triangle at top */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20">
                      <BotIcon className="w-12 h-12 text-green-600 animate-pulse" />
                    </div>
                  </div>

                  {/* Heading */}
                  <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-2 text-center">
                    No matching <br />
                    problems found!
                  </h3>
                  <p className="text-lg md:text-xl font-semibold text-green-700 mb-4 text-center">
                    Engage our assistant
                  </p>

                  {/* Description */}
                  <p className="text-sm md:text-base text-green-700/90 leading-relaxed mb-6 max-w-md text-center px-4">
                    Try adjusting your search terms <br />
                    or category filter, or let our AI analyze your unique
                    situation
                    <br /> for a precise diagnosis.
                  </p>

                  {/* CTA Button */}
                  <button className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:from-green-700 hover:to-emerald-700 transition-all duration-300" onClick={()=> window.location.href = '/chat'}>
                    <span>Ask the AI Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDoctor;