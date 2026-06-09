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

export default function Sidebar({
  items,
  activeView,
  onNavigate,
  userName,
  onLogout,
}: SidebarProps) {
  return (
    <>
      <div className="p-6 border-b border-[#4a3f35]">
        <div className="flex items-center gap-3 mb-2">
          <UserAvatar width={30} />
          <span className="text-[20px] font-bold text-[#d4a574]">
            {userName ?? "کاربر"}
          </span>
        </div>
        <span className="text-[17px] font-bold text-[#d4a574]">
          {new Date().toLocaleDateString("fa-IR")}
        </span>
      </div>

      <ul className="px-6 py-6 flex flex-col gap-1 flex-1">
        {items.map((item) => (
          <li key={item.key}>
            <button
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all w-full text-right ${
                activeView === item.key
                  ? "bg-[#d4a574] text-white"
                  : "text-[#a0826d] hover:bg-[#3d3228]"
              }`}
              onClick={() => onNavigate(item.key)}
            >
              <Icon icon={item.icon} className="w-5 h-5" />
              <span className="text-[18px] font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {onLogout && (
        <div className="px-6 pb-6">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl w-full text-right text-[#a0826d] hover:bg-[#3d3228] transition-all"
          >
            <Icon icon="mdi:logout" className="w-5 h-5" />
            <span className="text-[16px]">خروج</span>
          </button>
        </div>
      )}
    </>
  );
}
