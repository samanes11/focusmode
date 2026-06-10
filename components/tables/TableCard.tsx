import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import type { StudyTable } from "@/types";

interface TableCardProps {
  table: StudyTable;
  onJoin: (id: string) => void;
  isActive?: boolean;
}

export default function TableCard({ table, onJoin, isActive = true }: TableCardProps) {
  const onlineCount = table.members.filter(m => m.isOnline).length;
  const totalMinutes = table.members.reduce((sum, m) => sum + m.time, 0);

  return (
    <div 
      className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
        isActive 
          ? 'hover:shadow-2xl' 
          : 'opacity-75 hover:opacity-100'
      }`}
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(45, 37, 32, 0.8) 0%, rgba(42, 34, 24, 0.9) 100%)"
          : "linear-gradient(135deg, rgba(42, 34, 24, 0.6) 0%, rgba(26, 20, 16, 0.7) 100%)",
        border: `1.5px solid ${isActive ? 'rgba(212, 165, 116, 0.3)' : 'rgba(74, 63, 53, 0.4)'}`,
        backdropFilter: "blur(8px)",
        boxShadow: isActive 
          ? "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
          : "0 10px 25px rgba(0, 0, 0, 0.3)"
      }}
    >
      {/* Glow effect for active tables */}
      {/* {isActive && (
        <div 
          className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(196, 148, 100, 0.1))"
          }}
        />
      )} */}

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Title & Creator */}
        <div className="mb-4">
          <h3 className="text-xl font-black text-[#f0c892] mb-1.5 line-clamp-2">
            {table.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-[#a0826d]">
            <Icon icon="mdi:account" className="w-4 h-4" />
            {table.creator}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Members Count */}
          <div 
            className="rounded-xl p-3 transition-all"
            style={{
              background: "rgba(212, 165, 116, 0.08)",
              border: "1px solid rgba(212, 165, 116, 0.15)"
            }}
          >
            <div className="text-[11px] text-[#a0826d] mb-1">اعضا</div>
            <div className="text-xl font-black text-[#d4a574]">
              {table.members.length}
            </div>
          </div>

          {/* Online Count */}
          <div 
            className="rounded-xl p-3 transition-all"
            style={{
              background: isActive 
                ? "rgba(34, 197, 94, 0.08)" 
                : "rgba(160, 130, 109, 0.08)",
              border: isActive
                ? "1px solid rgba(34, 197, 94, 0.2)"
                : "1px solid rgba(160, 130, 109, 0.15)"
            }}
          >
            <div className="text-[11px] text-[#a0826d] mb-1">آنلاین</div>
            <div className={`text-xl font-black ${isActive ? 'text-green-400' : 'text-[#a0826d]'}`}>
              {onlineCount}
            </div>
          </div>
        </div>

        {/* Members Preview */}
        <div className="mb-6">
          <div className="text-xs text-[#a0826d] mb-2 flex items-center justify-between">
            <span>اعضای فعال</span>
            {totalMinutes > 0 && (
              <span className="text-[#d4a574]">
                {totalMinutes} دقیقه
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {table.members
              .filter(m => m.isOnline)
              .slice(0, 4)
              .map((member, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#1a1410] flex-shrink-0 ring-2 ring-[#2d2520]"
                  style={{
                    background: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                  }}
                  title={member.name}
                >
                  {member.name.charAt(0)}
                </div>
              ))}
            {table.members.filter(m => m.isOnline).length > 4 && (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#a0826d] flex-shrink-0 ring-2 ring-[#2d2520]"
                style={{ background: "rgba(160, 130, 109, 0.2)" }}
              >
                +{table.members.filter(m => m.isOnline).length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Join Button */}
        <Button 
          onClick={() => onJoin(table.id)}
          className={`w-full font-bold rounded-xl py-2.5 transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-[#d4a574] to-[#c49464] hover:from-[#e0b584] hover:to-[#d0a474] text-[#1a1410] shadow-lg hover:shadow-xl'
              : 'bg-[#4a3f35] hover:bg-[#5a4f45] text-[#a0826d] hover:text-[#d4a574]'
          }`}
        >
          <Icon icon="mdi:login" className="w-4 h-4 ml-2" />
          {isActive ? 'پیوستن به میز' : 'پیوستن'}
        </Button>
      </div>
    </div>
  );
}