import { Icon } from "@iconify/react";
import UserAvatar from "@/components/common/UserAvatar";
import type { MenuItem, ViewKey } from "@/types";

interface SidebarProps {
  items: MenuItem[];
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  userName?: string;
  onLogout?: () => void;
}

export default function Sidebar({ items, activeView, onNavigate, userName, onLogout }: SidebarProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#0e0b09" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-base flex-shrink-0"
          style={{ background: "rgba(212,165,116,0.12)" }}
        >
          ☕
        </div>
        <span className="text-[15px] font-semibold tracking-wide" style={{ color: "#e8d5c0" }}>
          Coffee Focus
        </span>
      </div>

      {/* User card */}
      <div className="mx-3 mb-5">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <UserAvatar width={30} />
          <div className="flex-1 min-w-0">
            <div
              className="text-[13px] font-medium truncate"
              style={{ color: "#e8d5c0" }}
            >
              {userName ?? "کاربر"}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "rgba(160,130,109,0.65)" }}>
              {new Date().toLocaleDateString("fa-IR")}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 flex flex-col gap-0.5">
        <span
          className="text-[10px] font-semibold tracking-widest px-2.5 pb-1 pt-1 block uppercase"
          style={{ color: "rgba(160,130,109,0.4)" }}
        >
          منو
        </span>

        {items.map((item) => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="relative flex items-center gap-2.5 w-full text-right px-3 py-2.5 rounded-[10px] transition-all duration-150"
              style={{
                background: isActive ? "rgba(212,165,116,0.1)" : "transparent",
                border: isActive
                  ? "1px solid rgba(212,165,116,0.18)"
                  : "1px solid transparent",
                color: isActive ? "#f0c892" : "rgba(160,130,109,0.7)",
              }}
            >
              {isActive && (
                <span
                  className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-sm"
                  style={{ background: "#d4a574" }}
                />
              )}
              <Icon
                icon={item.icon}
                className="w-4 h-4 flex-shrink-0"
                style={{ color: isActive ? "#f0c892" : "rgba(160,130,109,0.6)" }}
              />
              <span className="text-[13px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 my-2" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* Logout */}
      {onLogout && (
        <div className="p-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] transition-all duration-150 text-[13px] font-medium"
            style={{
              background: "transparent",
              border: "1px solid transparent",
              color: "rgba(160,130,109,0.5)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(220,60,60,0.08)";
              (e.currentTarget as HTMLElement).style.color = "#e07070";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(220,60,60,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "rgba(160,130,109,0.5)";
              (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            }}
          >
            <Icon icon="mdi:logout" className="w-4 h-4 flex-shrink-0" />
            خروج
          </button>
        </div>
      )}
    </div>
  );
}