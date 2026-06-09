import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Window from "@/components/common/Window";
import TableCard from "./TableCard";
import type { StudyTable } from "@/types";

interface TablesViewProps {
  tables: StudyTable[];
  loading?: boolean;
  onJoin: (id: string) => void;
  onCreateClick: () => void;
}

export default function TablesView({ tables, loading, onJoin, onCreateClick }: TablesViewProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[25px] font-bold text-[#d4a574]">میزهای فعال</span>
        <Button onClick={onCreateClick} className="bg-yellow-700 hover:bg-yellow-600 text-white">
          <Icon icon="mdi:plus" className="w-[22px] h-[22px] ml-1" />
          <span className="text-[20px]">ایجاد میز جدید</span>
        </Button>
      </div>

      {loading ? (
        <Window contentbgcolor="#2d2520" contentStyle={{ padding: 20, borderRadius: 20 }}>
          <div className="flex flex-col items-center justify-center text-center py-12 text-[#a0826d]">
            <Icon icon="mdi:loading" className="w-[48px] h-[48px] mx-auto mb-4 opacity-50 animate-spin" />
            <span className="text-[15px]">در حال بارگذاری میزها...</span>
          </div>
        </Window>
      ) : tables.length === 0 ? (
        <Window contentbgcolor="#2d2520" contentStyle={{ padding: 20, borderRadius: 20 }}>
          <div className="flex flex-col items-center justify-center text-center py-12 text-[#a0826d]">
            <Icon icon="mdi:account-group" className="w-[64px] h-[64px] mx-auto mb-4 opacity-50" />
            <span className="text-[15px]">هنوز میزی ایجاد نشده است</span>
          </div>
        </Window>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {tables.map(table => (
            <TableCard key={table.id} table={table} onJoin={onJoin} />
          ))}
        </div>
      )}
    </div>
  );
}