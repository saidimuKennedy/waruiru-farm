"use client";

import React from "react";
import { Problem } from "@/types/problems";
import ProblemCard from "./problem-card";
import NoResults from "./no-results";

interface ProblemListProps {
  problems: Problem[];
  activeCard: string | null;
  setActiveCard: (id: string | null) => void;
}

/**
 * Renders a grid of ProblemCard components.
 * Handles empty states by showing NoResults.
 */
const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  activeCard,
  setActiveCard,
}) => {
  if (problems.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {problems.map((problem, index) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          index={index}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
      ))}
    </div>
  );
};

export default ProblemList;
