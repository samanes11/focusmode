import type { WeeklyStat } from "@/types";
import Window from "./Window";

interface WeeklyChartProps {
  weeklyStats: WeeklyStat[];
  barHeight?: string;
}

export default function WeeklyChart({ weeklyStats, barHeight = "h-[160px]" }: WeeklyChartProps) {
  const items  = weeklyStats ?? [];
  const values = items.map(s => s.minutes ?? 0);
  const maxVal = Math.max(1, ...values);
  const cap    = Math.ceil(maxVal / 30) * 30;
  const maxIdx = values.length === 0 ? -1 : values.reduce((mi, v, i) => (v > values[mi] ? i : mi), 0);
  const total  = values.reduce((a, b) => a + b, 0);
  const bestDay = maxIdx >= 0 ? items[maxIdx] : null;
  const hasData = items.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
        <div className="rounded-full border border-[#3b322a] bg-[#14110e] px-3 py-1 text-xs text-[#cbb8a6]">
          جمع هفته: <span className="text-[#f0c892] font-bold">{total}</span> دقیقه
        </div>
        {bestDay && (
          <div className="rounded-full border border-[#3b322a] bg-[#14110e] px-3 py-1 text-xs text-[#cbb8a6]">
            بهترین روز: <span className="text-[#f0c892] font-bold">{bestDay.day}</span> ({bestDay.minutes ?? 0} دقیقه)
          </div>
        )}
      </div>

      {/* Chart */}
      <Window style={{ backgroundColor: "#2d2520", borderRadius: 16 }}>
        <div className="rounded-2xl p-4 sm:p-5 border border-[#3b322a]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-[#ead8c6]">عملکرد هفتگی</span>
            <span className="text-xs text-[#a0826d]">سقف: {cap} دقیقه</span>
          </div>

          {!hasData ? (
            <div className="rounded-xl border border-[#2b241e] bg-[#120f0c] p-4 text-sm text-[#a0826d]">
              هنوز داده‌ای برای نمایش نداریم. چند فنجون که بزنی اینجا جذاب می‌شه :)
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map(i => <div key={i} className="h-px w-full bg-white/5" />)}
              </div>
              <div className="overflow-x-auto">
                <div className="flex justify-between gap-4" style={{ minWidth: Math.max(7, items.length) * 56 }}>
                  {items.map((s, i) => {
                    const v      = s.minutes ?? 0;
                    const pct    = Math.max(0, Math.min(100, (v / cap) * 100));
                    const isMax  = i === maxIdx;
                    return (
                      <div key={s.day ?? i} className="flex flex-col items-center gap-2 flex-1">
                        <div className={[
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          isMax ? "bg-[#d4a574]/15 text-[#f0c892] border border-[#d4a574]/40" : "bg-white/5 text-[#cbb8a6] border border-white/10",
                        ].join(" ")}>
                          {v}
                        </div>
                        <div className={[
                          `relative overflow-hidden ${barHeight} w-10 rounded-2xl bg-[#2a221c] border border-white/10`,
                          isMax ? "ring-2 ring-[#d4a574]" : "",
                        ].join(" ")}>
                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-b-2xl transition-[height] duration-500"
                            style={{
                              height: `${pct}%`,
                              background: "linear-gradient(180deg, rgba(240,200,146,0.95) 0%, rgba(212,136,27,0.95) 100%)",
                              boxShadow: "0 -10px 24px rgba(212,136,27,0.18)",
                            }}
                          />
                          {v === 0 && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white/10" />}
                        </div>
                        <span className={["text-[10px] whitespace-nowrap", isMax ? "font-bold text-[#f0c892]" : "text-[#a0826d]"].join(" ")}>
                          {s.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Window>
    </div>
  );
}
