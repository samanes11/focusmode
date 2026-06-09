import { Icon } from "@iconify/react";
import Window from "@/components/common/Window";

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: string;
}

export default function StatCard({ label, value, unit, icon }: StatCardProps) {
  return (
    <Window style={{ backgroundColor: "#2d2520", borderRadius: 15 }}>
      <div className="flex flex-col justify-between gap-2 p-3 sm:p-4 lg:p-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-[17px] text-gray-100 font-bold">{label}</span>
          <Icon icon={icon} className="w-6 h-6 sm:w-8 sm:h-8 text-[#ca8247]" />
        </div>
        <span className="font-bold text-[#ca8247] text-2xl">{value}</span>
        <span className="text-[12px] text-[#ca8247]">{unit}</span>
      </div>
    </Window>
  );
}
