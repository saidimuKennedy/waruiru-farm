import {
    Droplets,
    Sprout,
    Sun,
    Bug,
    HelpCircle,
    Zap,
  } from "lucide-react";

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
