import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Window from "@/components/common/Window";
import type { StudyTable } from "@/types";

interface TableCardProps {
  table: StudyTable;
  onJoin: (id: string) => void;
}

export default function TableCard({ table, onJoin }: TableCardProps) {
  const onlineCount = table.members.filter(m => m.isOnline).length;

  return (
    <Window contentbgcolor="#2d2520" contentStyle={{ padding: 16, borderRadius: 15 }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[20px] text-[#d4a574] font-bold font-mono block">{table.name}</span>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="gap-1 border-[#4a3f35] text-[#a0826d]">
              <Icon icon="mdi:account-group" className="w-[16px] h-[16px]" />
              {table.members.length} عضو
            </Badge>
            <Badge className="gap-1 bg-green-900/40 text-green-400 border border-green-800">
              <Icon icon="mdi:account-check" className="w-[16px] h-[16px]" />
              {onlineCount} آنلاین
            </Badge>
          </div>
          <span className="text-[18px] text-[#8a7561] mt-2 block">سازنده: {table.creator}</span>
        </div>
        <Button className="bg-yellow-700 hover:bg-yellow-600 text-white shrink-0" onClick={() => onJoin(table.id)}>
          <span className="text-[16px]">پیوستن</span>
        </Button>
      </div>
    </Window>
  );
}
