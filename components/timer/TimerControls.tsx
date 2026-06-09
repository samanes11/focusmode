import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Window from "@/components/common/Window";

interface TimerControlsProps {
  selectedTime: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onSetDuration: (minutes: number) => void;
}

export default function TimerControls({ selectedTime, isRunning, onStart, onPause, onSetDuration }: TimerControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Window style={{ backgroundColor: "#1a1410", borderRadius: 16 }}>
        <div className="p-5 w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-bold text-[#d4a574]">مدت زمان مطالعه</span>
            <Badge variant="outline" className="border-yellow-600 text-yellow-400 gap-1">
              <Icon icon="mdi:clock-outline" className="w-[14px] h-[14px]" />
              {selectedTime} دقیقه
            </Badge>
          </div>
          <Slider
            min={5} max={60} step={5}
            value={[selectedTime]}
            onValueChange={([v]) => !isRunning && onSetDuration(v)}
            disabled={isRunning}
            className="w-full"
            dir="ltr"
          />
          <div className="flex items-center justify-between px-2 mt-3">
            <span className="text-[14px] text-[#a0826d]">60 دقیقه</span>
            <span className="text-[14px] text-[#a0826d]">5 دقیقه</span>
          </div>
        </div>
      </Window>

      {!isRunning ? (
        <Button onClick={onStart} className="w-full rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white font-bold">
          <Icon icon="qlementine-icons:play-24" className="w-[5] h-[5] ml-1" />
          شروع دم‌ کشیدن
        </Button>
      ) : (
        <Button onClick={onPause} className="w-full rounded-lg bg-red-700 hover:bg-red-500">
          <Icon icon="qlementine-icons:pause-24" className="w-[5] h-[5] ml-1" />
          استراحت
        </Button>
      )}
    </div>
  );
}
