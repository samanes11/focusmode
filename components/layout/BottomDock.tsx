import { Icon } from "@iconify/react";
import type { MenuItem, ViewKey } from "@/types";

interface BottomDockProps {
  items: MenuItem[];
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

export default function BottomDock({ items, activeView, onNavigate }: BottomDockProps) {
  return (
    <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-xs">
      <div
        className="flex justify-around items-center px-3 py-2 rounded-[48px]"
        style={{
          background: "rgba(30, 20, 12, 0.45)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(212, 165, 116, 0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 1.5px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
        }}
      >
        {items.map(item => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300"
              style={{
                background: isActive ? "rgba(212, 165, 116, 0.18)" : "transparent",
                boxShadow: isActive ? "0 2px 12px rgba(212,165,116,0.15), 0 1px 0 rgba(255,255,255,0.08) inset" : "none",
                border: isActive ? "1px solid rgba(212,165,116,0.28)" : "1px solid transparent",
              }}
            >
              {isActive && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "#d4a574", boxShadow: "0 0 6px 2px rgba(212,165,116,0.7)" }}
                />
              )}
              <Icon
                icon={item.icon}
                className="w-[22px] h-[22px] transition-all duration-300"
                style={{
                  color: isActive ? "#f0c892" : "rgba(160,130,109,0.7)",
                  filter: isActive ? "drop-shadow(0 0 6px rgba(212,165,116,0.6))" : "none",
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                }}
              />
              <span
                className="text-[11px] font-medium transition-all duration-300"
                style={{ color: isActive ? "#f0c892" : "rgba(160,130,109,0.6)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
