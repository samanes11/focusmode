import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Window from "@/components/common/Window";
import UserAvatar from "@/components/common/UserAvatar";
import type { TableMember } from "@/types";

const RANK_ICONS: Record<number, string> = {
  1: "fluent-emoji-flat:1st-place-medal",
  2: "fluent-emoji-flat:2nd-place-medal",
  3: "fluent-emoji-flat:3rd-place-medal",
};

interface ActiveTableProps {
  tableName: string;
  members: TableMember[];
  onLeave: () => void;
  onMemberClick: (name: string) => void;
}

export default function ActiveTable({ tableName, members, onLeave, onMemberClick }: ActiveTableProps) {
  return (
    <Window style={{ backgroundColor: "#1a1410", borderRadius: 16, marginBottom: 24 }}>
      <div className="p-5 w-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] font-bold text-[#d4a574] font-mono">میز: {tableName}</span>
          <Badge variant="outline" className="border-yellow-600 text-yellow-400 gap-1">
            <Icon icon="mdi:account-group" className="w-[14px] h-[14px]" />
            {members.length} نفر
          </Badge>
        </div>

        <div className="space-y-2">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="bg-[#2d2520] rounded-xl p-3 border border-[#3d3228] cursor-pointer transition-all hover:scale-[1.02] hover:border-[#4d4238]"
              onClick={() => onMemberClick(member.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar width={25} />
                  <div>
                    <span className="text-[14px] text-[#a0826d] block">{member.name}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:calendar-today" className="w-[14px] h-[14px] text-[#a0826d]" />
                        <span className="text-[10px] text-[#a0826d]">امروز: {member.todayMinutes} دقیقه</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:timer-outline" className="w-[14px] h-[14px] text-[#a0826d]" />
                        <span className="text-[10px] text-[#a0826d]">جلسه: {member.time} دقیقه</span>
                      </div>
                    </div>
                  </div>
                </div>
                {RANK_ICONS[idx + 1] && member.todayMinutes > 0 && (
                  <Icon icon={RANK_ICONS[idx + 1]} className="w-[25px] h-[25px]" />
                )}
              </div>
            </div>
          ))}
        </div>

        <Button variant="destructive" size="sm" className="w-full mt-3 rounded-2xl" onClick={onLeave}>
          <Icon icon="mdi:exit-to-app" className="w-[16px] h-[16px] ml-1" />
          خروج از میز
        </Button>
      </div>
    </Window>
  );
}
