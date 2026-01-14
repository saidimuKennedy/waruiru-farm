import { ProblemSeverity } from "@prisma/client";

/**
 * Represents a diagnosed agricultural problem.
 */
export interface Problem {
  id: string;
  title: string;
  category: string;
  severity: ProblemSeverity;
  image: string;
  emoji: string;
  cause: string[];
  followUp: string[];
  timeToFix: string;
  difficulty: string;
  action: string[];
}
