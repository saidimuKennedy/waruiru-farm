import { useState, useEffect } from "react";
import { Search, TestTube, Brain, MessageSquare } from "lucide-react";

/**
 * Animated loading indicator showing the AI's "thought process".
 * Cycles through relevant icons (Search, TestTube, Brain, MessageSquare).
 */
const DiagnosingTrain: React.FC = () => {
  const icons = [Search, TestTube, Brain, MessageSquare];
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % icons.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-green-600 text-sm overflow-hidden">
      {icons.map((Icon, i) => {
        // Calculate which icon is "active"
        const isActive = i === offset;
        return (
          <Icon
            key={i}
            className={`w-4 h-4 transition-transform duration-300 ${
              isActive ? "translate-y-0 scale-125 opacity-100" : "translate-y-2 scale-90 opacity-50"
            }`}
          />
        );
      })}
      <span>just a sec...</span>
    </div>
  );
};

export default DiagnosingTrain;

