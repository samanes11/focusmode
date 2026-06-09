import { Icon } from "@iconify/react";
import StatCard from "./StatCard";
import WeeklyChart from "@/components/common/WeeklyChart";
import type { UserStats } from "@/types";

const STAT_CARDS = [
  { label: "امروز",          unit: "دقیقه",     icon: "fluent:clipboard-day-20-regular",   key: "todayMinutes"      },
  { label: "فنجون‌ها",       unit: "تکمیل شده", icon: "mdi:coffee",                        key: "completedSessions" },
  { label: "میانگین روزانه", unit: "دقیقه",     icon: "material-symbols:avg-pace-rounded", key: "averageDaily"      },
  { label: "رکورد",          unit: "دقیقه",     icon: "mage:goals",                        key: "record"            },
] as const;

interface StatsViewProps {
  stats: UserStats;
  loading?: boolean;
}

export default function StatsView({ stats, loading }: StatsViewProps) {
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-[#a0826d]">
        <Icon icon="mdi:loading" className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => (
          <StatCard key={card.key} label={card.label} value={stats[card.key]} unit={card.unit} icon={card.icon} />
        ))}
      </div>
      <WeeklyChart weeklyStats={stats.weeklyStats} barHeight="h-[160px] sm:h-[190px]" />
    </div>
  );
}