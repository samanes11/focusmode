import WindowFloat from "@/components/WindowFloat";
import StatCard from "./StatCard";
import WeeklyChart from "@/components/common/WeeklyChart";
import type { UserStats } from "@/types";

const STAT_CARDS = [
  { label: "امروز",          unit: "دقیقه",       icon: "fluent:clipboard-day-20-regular",      key: "todayMinutes"      },
  { label: "فنجون‌ها",       unit: "تکمیل شده",   icon: "mdi:coffee",                           key: "completedSessions" },
  { label: "میانگین روزانه", unit: "دقیقه",       icon: "material-symbols:avg-pace-rounded",    key: "averageDaily"      },
  { label: "رکورد",          unit: "دقیقه",       icon: "mage:goals",                           key: "record"            },
] as const;

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: UserStats | null;
  userName: string;
}

export default function StatsModal({ open, onClose, stats, userName }: StatsModalProps) {
  if (!open || !stats) return null;

  return (
    <WindowFloat
      onclose={onClose}
      title={`آمار ${userName}`}
      maxWidth="500px"
      padding={16}
      contentStyle={{ background: "linear-gradient(145deg, #2a1e14, #1e140c)", border: "1px solid rgba(212,165,116,0.2)" }}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {STAT_CARDS.map(card => (
            <StatCard key={card.key} label={card.label} value={stats[card.key]} unit={card.unit} icon={card.icon} />
          ))}
        </div>
        <WeeklyChart weeklyStats={stats.weeklyStats} barHeight="h-[100px]" />
      </div>
    </WindowFloat>
  );
}
