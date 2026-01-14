
import { Filter, Droplets, Sun, Leaf, AlertTriangle } from "lucide-react";

/**
 * Categories for filtering farm problems in the bot interface.
 */
export const categories = [
  { id: "all", name: "All Problems", icon: Filter },
  { id: "watering", name: "Watering Issues", icon: Droplets },
  { id: "nutrients", name: "Nutrients", icon: Leaf },
  { id: "soil", name: "Soil Health", icon: Sun },
  { id: "disease", name: "Disease", icon: AlertTriangle },
];
