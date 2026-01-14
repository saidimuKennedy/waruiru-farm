"use client";

import React, { useState, useEffect } from "react";
import { Filter, Droplets, Sun, Leaf, AlertTriangle } from "lucide-react";
import { Problem } from "@/types/problems";
import SearchAndFilter from "@/components/bot/search-filter";
import ProblemList from "@/components/bot/problem-list";
import BackgroundDecorations from "@/components/bot/bg-decorations";
import HeroSection from "@/components/bot/hero-section";
import { Skeleton } from "@/components/ui/skeleton";

import { categories } from "@/constants/bot";

/**
 * Farm Doctor AI diagnosis page.
 * Features a hero section with severe problems, search/filter functionality,
 * and a grid of problem cards.
 * Fetches problem data from the API.
 */
const FarmDoctor = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [farmProblems, setFarmProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentHeroProblemIndex, setCurrentHeroProblemIndex] = useState(0);

  const highSeverityProblems = farmProblems.filter(
    (p) => p.severity === "HIGH"
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data: Problem[] = await response.json();
        setFarmProblems(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
    if (highSeverityProblems.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroProblemIndex(
          (prevIndex) => (prevIndex + 1) % highSeverityProblems.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [farmProblems, highSeverityProblems.length]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      <BackgroundDecorations />

      <HeroSection problem={currentHeroProblem} />

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
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <ProblemList
            problems={filteredProblems}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
          />
        )}
      </div>
    </div>
  );
};

export default FarmDoctor;
