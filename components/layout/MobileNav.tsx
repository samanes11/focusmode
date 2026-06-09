import { Icon } from "@iconify/react";
import UserAvatar from "@/components/common/UserAvatar";

interface MobileNavProps {
  onMenuOpen: () => void;
  userName?: string;
  onLogout?: () => void;
}

export default function MobileNav({ onMenuOpen, userName, onLogout }: MobileNavProps) {
  return (
    <nav className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#2d2520] border-b border-[#4a3f35]">
      <div className="flex items-center gap-3 text-[#d4a574]">
        <UserAvatar width={25} />
        <span className="text-[15px]">{userName ?? "کاربر"}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[15px] font-bold text-[#d4a574]">
          {new Date().toLocaleDateString("fa-IR")}
        </span>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[#a0826d] hover:bg-[#3d3228] hover:text-[#d4a574] transition-all"
            title="خروج"
            aria-label="خروج"
          >
            <Icon icon="mdi:logout" className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
}