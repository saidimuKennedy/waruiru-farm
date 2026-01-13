"use client";

import React from "react";
import { categories } from "@/constants/bot";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
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
  );
};

export default SearchAndFilter;