import { Icon } from "@iconify/react";
import UserAvatar from "@/components/common/UserAvatar";

interface MobileNavProps {
  onMenuOpen: () => void;
  userName?: string;
}

export default function MobileNav({ onMenuOpen, userName }: MobileNavProps) {
  return (
    <nav className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#2d2520] border-b border-[#4a3f35]">
      <div className="flex items-center gap-3 text-[#d4a574]">
        <UserAvatar width={25} />
        <span className="text-[15px]">{userName ?? "کاربر"}</span>
      </div>
      <span className="text-[15px] font-bold text-[#d4a574]">
        {new Date().toLocaleDateString("fa-IR")}
      </span>
    </nav>
  );
}