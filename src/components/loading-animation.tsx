import Image from "next/image";

const style = (
  <style jsx>{`
    @keyframes pulse-slow {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
        filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.4));
      }
      50% {
        transform: scale(1.25);
        opacity: 0.8;
        filter: drop-shadow(0 0 16px rgba(255, 0, 0, 0.7));
      }
    }
  `}</style>
);

export default function LoadingLogo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {style}
      <div className="relative animate-[pulse-slow_2.2s_cubic-bezier(0.4,0,0.2,1)_infinite] p-4">
        <Image
          src="/waruiru&logo.png"
          width={80}
          height={80}
          alt="Waruiru Farm Logo"
          className="sm:w-[100px] sm:h-[100px] rounded-full"
        />
      </div>
    </div>
  );
}
