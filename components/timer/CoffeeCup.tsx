import { Icon } from "@iconify/react";
import Window from "@/components/common/Window";

interface CoffeeCupProps {
  percentage: number;
}

function BrewStatus({ percentage }: { percentage: number }) {
  if (percentage < 30)  return <span className="text-[14px] flex items-center gap-1"><Icon icon="mdi:loading" className="w-[16px] h-[16px] animate-spin" />شروع دم کشیدن...</span>;
  if (percentage < 70)  return <span className="text-[14px] flex items-center gap-2"><span className="inline-block w-2 h-2 bg-[#d4a574] rounded-full animate-pulse" />قهوه در حال آماده شدن است</span>;
  if (percentage < 100) return <span className="text-[14px] flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />قهوه تقریباً آماده است</span>;
  return <span className="text-[14px] flex items-center gap-2"><Icon icon="mdi:check-circle" className="w-[16px] h-[16px] text-green-500" />قهوه آماده است</span>;
}

export default function CoffeeCup({ percentage }: CoffeeCupProps) {
  const fillY      = 240 - percentage * 1.78;
  const fillHeight = percentage * 1.78;

  return (
    <Window contentbgcolor="#2d2520" contentStyle={{ borderRadius: 20 }}>
      {/* Cup SVG */}
      <div className="relative p-8 pb-4">
        <div className="relative w-full max-w-xs mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-600/20 to-transparent blur-3xl rounded-full" />
          <svg viewBox="0 0 200 280" className="w-full h-auto relative z-10 drop-shadow-2xl">
            <defs>
              <linearGradient id="coffeeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#6B4423" />
                <stop offset="40%" stopColor="#8B5A2B" />
                <stop offset="100%" stopColor="#A0662F" />
              </linearGradient>
              <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="100%" stopColor="#57534e" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
              </filter>
              <clipPath id="cupClip">
                <path d="M 42 80 L 42 220 Q 42 238 60 238 L 140 238 Q 158 238 158 220 L 158 80 Q 158 62 140 62 L 60 62 Q 42 62 42 80" />
              </clipPath>
            </defs>

            {/* Body */}
            <path d="M 40 80 L 40 220 Q 40 240 60 240 L 140 240 Q 160 240 160 220 L 160 80 Q 160 60 140 60 L 60 60 Q 40 60 40 80" fill="url(#cupGradient)" stroke="#44403c" strokeWidth="2" filter="url(#shadow)" />
            <path d="M 45 80 L 45 218 Q 45 235 60 235 L 140 235 Q 155 235 155 218 L 155 80" fill="none" stroke="#292524" strokeWidth="1" opacity="0.5" />

            {/* Coffee fill */}
            <rect x="42" y={fillY} width="116" height={fillHeight} fill="url(#coffeeGradient)" clipPath="url(#cupClip)" />
            {percentage > 5 && <ellipse cx="100" cy={fillY + 2} rx="50" ry="6" fill="#A0662F" opacity="0.6" clipPath="url(#cupClip)" />}

            {/* Handle */}
            <path d="M 160 100 Q 185 100 185 125 L 185 135 Q 185 160 160 160" fill="none" stroke="url(#cupGradient)" strokeWidth="8" strokeLinecap="round" filter="url(#shadow)" />
            <path d="M 160 100 Q 185 100 185 125 L 185 135 Q 185 160 160 160" fill="none" stroke="#44403c" strokeWidth="2" />

            {/* Rim */}
            <ellipse cx="100" cy="60" rx="58" ry="10" fill="#78716c" opacity="0.8" />
            <ellipse cx="100" cy="58" rx="58" ry="8" fill="url(#cupGradient)" />

            {/* Steam */}
            {percentage > 20 && (
              <g opacity="0.7">
                <path d="M 70 50 Q 75 35 80 50"   fill="none" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                <path d="M 100 45 Q 105 30 110 45" fill="none" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
                <path d="M 130 50 Q 135 35 140 50" fill="none" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
              </g>
            )}
          </svg>

          {percentage > 30 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400/40 rounded-full animate-ping" />
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-400/40 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-8 pb-8">
        <Window style={{ backgroundColor: "#1a1410", borderRadius: 16 }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-medium text-[#a0826d]">پیشرفت دم کشیدن</span>
              <span className="text-[20px] font-bold text-[#d4a574]">{Math.round(percentage)}%</span>
            </div>
            <div className="relative h-3 bg-[#2a221c] rounded-full overflow-hidden mb-4 shadow-inner">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  background: "linear-gradient(90deg, rgba(212,165,116,0.95) 0%, rgba(196,148,100,0.95) 100%)",
                  boxShadow: "0 0 18px rgba(212,165,116,0.18)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-center flex items-center justify-center gap-2 text-[#a0826d]">
              <BrewStatus percentage={percentage} />
            </div>
          </div>
        </Window>
      </div>
    </Window>
  );
}
