import {
    Droplets,
    Sprout,
    Sun,
    Bug,
    HelpCircle,
    Zap,
  } from "lucide-react";

/**
 * Returns the appropriate icon component for a given problem category and severity.
 *
 * @param {string} category - The problem category (e.g., 'watering', 'nutrients').
 * @param {string} severity - The severity level (e.g., 'HIGH').
 * @returns {LucideIcon} The Lucide icon component.
 */
export const getProblemIcon = (category: string, severity: string) => {
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
