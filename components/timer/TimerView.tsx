import Window from "@/components/common/Window";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import CoffeeCup from "./CoffeeCup";
import ActiveTable from "./ActiveTable";
import type { TableMember } from "@/types";

interface TimerViewProps {
  timeLeft: number;
  isRunning: boolean;
  selectedTime: number;
  coffeePercentage: number;
  currentTableId: string | null;
  currentTableName: string;
  currentTableMembers: TableMember[];
  onStart: () => void;
  onPause: () => void;
  onSetDuration: (minutes: number) => void;
  onLeaveTable: () => void;
  onMemberClick: (name: string) => void;
}

export default function TimerView({
  timeLeft, isRunning, selectedTime, coffeePercentage,
  currentTableId, currentTableName, currentTableMembers,
  onStart, onPause, onSetDuration, onLeaveTable, onMemberClick,
}: TimerViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Left: Controls */}
      <Window contentbgcolor="#2d2520" contentStyle={{ padding: 0, borderRadius: 20, overflow: "hidden", minHeight: "600px" }}>
        <div className="flex flex-col items-center justify-center p-6 h-full gap-6" style={{ minHeight: "600px" }}>
          <TimerDisplay timeLeft={timeLeft} />

          {currentTableId && (
            <ActiveTable
              tableName={currentTableName}
              members={currentTableMembers}
              onLeave={onLeaveTable}
              onMemberClick={onMemberClick}
            />
          )}

          <TimerControls
            selectedTime={selectedTime}
            isRunning={isRunning}
            onStart={onStart}
            onPause={onPause}
            onSetDuration={onSetDuration}
          />
        </div>
      </Window>

      {/* Right: Coffee cup */}
      <CoffeeCup percentage={coffeePercentage} />
    </div>
  );
}
