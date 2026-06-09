import Window from "@/components/common/Window";

interface TimerDisplayProps {
  timeLeft: number;
}

export default function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <Window style={{ backgroundColor: "#1a1410", borderRadius: 24 }}>
      <div className="flex items-center justify-center p-8 gap-3">
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#d4a574] to-[#c49464] text-[#1a1410] rounded-2xl p-4 min-w-[100px] shadow-lg">
            <div className="flex flex-col items-center justify-evenly text-6xl font-black">{seconds}</div>
          </div>
          <span className="text-[13px] text-[#a0826d] mt-3 font-medium block">ثانیه</span>
        </div>
        <div className="text-5xl text-[#d4a574] font-black pb-8 animate-pulse">:</div>
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#d4a574] to-[#c49464] text-[#1a1410] rounded-2xl p-4 min-w-[100px] shadow-lg">
            <div className="flex flex-col items-center justify-evenly text-6xl font-black">{minutes}</div>
          </div>
          <span className="text-[13px] text-[#a0826d] mt-3 font-medium block">دقیقه</span>
        </div>
      </div>
    </Window>
  );
}
