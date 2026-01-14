import { BotIcon, ArrowRight } from "lucide-react";

/**
 * Displays a promotional card encouraging users to use the AI assistant.
 * Features an SVG illustration and a call-to-action button.
 */
const AlertCard = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="relative max-w-2xl mx-auto">
        <div className="relative drop-shadow-2xl">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-auto"
            style={{
              filter:
                "drop-shadow(0 20px 50px rgba(34, 197, 94, 0.25)) drop-shadow(0 10px 20px rexport default AlertCard;gba(0, 0, 0, 0.15))",
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

          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-12 py-16"
            style={{
              top: "10%",
              height: "80%",
            }}
          >
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20">
                <BotIcon className="w-12 h-12 text-green-600 animate-pulse" />
              </div>
            </div>

            <p className="text-lg md:text-xl font-semibold text-green-700 mb-4 text-center">
              {" "}
              <span className="text-2xl text-green-800">Questions!</span>{" "}
              <br className="md:none" /> Engage our assistant
            </p>

            <button
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              onClick={() => (window.location.href = "/chat")}
            >
              <span>Ask the AI Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlertCard;