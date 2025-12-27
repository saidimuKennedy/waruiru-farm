import React from "react";

const BackgroundDecorations = () => {
  return (
    <>
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

      <div
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "7s", animationDelay: "1s" }}
      ></div>
    </>
  );
};

export default BackgroundDecorations;
