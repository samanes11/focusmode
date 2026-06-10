import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Window from "@/components/common/Window";
import TableCard from "./TableCard";
import type { StudyTable } from "@/types";
import { useState } from "react";

interface TablesViewProps {
  tables: StudyTable[];
  loading?: boolean;
  onJoin: (id: string) => void;
  onCreateClick: () => void;
}

export default function TablesView({ tables, loading, onJoin, onCreateClick }: TablesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTables = tables.filter(table =>
    table.name.includes(searchQuery) || table.creator.includes(searchQuery)
  );

  const activeTables = filteredTables.filter(t => t.members.some(m => m.isOnline));
  const inactiveTables = filteredTables.filter(t => !t.members.some(m => m.isOnline));

  return (
    <div className="w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black text-[#f0c892] mb-2">میزهای مطالعه</h1>
            <p className="text-[#a0826d]">به یک میز بپیوندید یا میز جدید ایجاد کنید</p>
          </div>
          <Button 
            onClick={onCreateClick} 
            className="bg-gradient-to-r from-[#d4a574] to-[#c49464] hover:from-[#e0b584] hover:to-[#d0a474] text-[#1a1410] font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Icon icon="mdi:plus" className="w-5 h-5 ml-2" />
            میز جدید
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Icon 
            icon="mdi:magnify" 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0826d] pointer-events-none"
          />
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا سازنده..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a2218] border border-[#4a3f35] rounded-2xl py-3 pr-12 pl-4 text-[#ead8c6] placeholder-[#a0826d] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="h-56 bg-[#2d2520] rounded-2xl animate-pulse border border-[#3d3228]"
            />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <Window contentbgcolor="#2d2520" contentStyle={{ padding: 40, borderRadius: 24 }}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#d4a574]/10 flex items-center justify-center mb-4">
              <Icon icon="mdi:account-group" className="w-10 h-10 text-[#d4a574]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#ead8c6] mb-2">هنوز میزی ایجاد نشده است</h3>
            <p className="text-[#a0826d] mb-6 max-w-xs">
              میز جدید بسازید و با دوستانتان به دنبال اهداف مطالعه‌ی خود بروید
            </p>
            <Button 
              onClick={onCreateClick}
              className="bg-[#d4a574] hover:bg-[#c49464] text-[#1a1410] font-bold px-6 py-2 rounded-xl"
            >
              ایجاد اولین میز
            </Button>
          </div>
        </Window>
      ) : (
        <div className="space-y-8">
          {/* Active Tables */}
          {activeTables.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h2 className="text-[16px] font-bold text-[#ead8c6]">میزهای فعال</h2>
                <span className="text-[13px] text-[#a0826d] bg-[#2a2218] px-2.5 py-0.5 rounded-full">
                  {activeTables.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeTables.map(table => (
                  <TableCard key={table.id} table={table} onJoin={onJoin} isActive={true} />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Tables */}
          {inactiveTables.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-[#a0826d]" />
                <h2 className="text-[16px] font-bold text-[#ead8c6]">میزهای غیرفعال</h2>
                <span className="text-[13px] text-[#a0826d] bg-[#2a2218] px-2.5 py-0.5 rounded-full">
                  {inactiveTables.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {inactiveTables.map(table => (
                  <TableCard key={table.id} table={table} onJoin={onJoin} isActive={false} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredTables.length === 0 && searchQuery && (
            <Window contentbgcolor="#2d2520" contentStyle={{ padding: 30, borderRadius: 24 }}>
              <div className="flex flex-col items-center justify-center text-center">
                <Icon icon="mdi:magnify-off" className="w-12 h-12 text-[#a0826d] mb-3" />
                <h3 className="text-[16px] font-bold text-[#ead8c6] mb-2">نتیجه‌ای یافت نشد</h3>
                <p className="text-[#a0826d] text-sm">
                  "{searchQuery}" را در میزها پیدا نکردیم
                </p>
              </div>
            </Window>
          )}
        </div>
      )}
    </div>
  );
}