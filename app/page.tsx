"use client";

import { useState, useCallback } from "react";
import { useTimer, useUserStats } from "@/hooks/useTimer";
import { useTables } from "@/hooks/useTables";
import { MOCK_USER_STATS, MENU_ITEMS } from "@/data/mock";

import Drawer from "@/components/Drawer";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import BottomDock from "@/components/layout/BottomDock";

import TimerView from "@/components/timer/TimerView";
import TablesView from "@/components/tables/TablesView";
import StatsView from "@/components/stats/StatsView";
import CreateTableModal from "@/components/tables/CreateTableModal";
import StatsModal from "@/components/stats/StatsModal";

import type { ViewKey, UserStats } from "@/types";

export default function CoffeeFocusPage() {
  const [view, setView]           = useState<ViewKey>("timer");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // stats modal
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsModalUser, setStatsModalUser] = useState("");
  const [statsModalData, setStatsModalData] = useState<UserStats | null>(null);

  // create table modal
  const [createTableOpen, setCreateTableOpen] = useState(false);

  // ── Hooks ──────────────────────────────────────────────────────────────────

  const { stats, addMinutes, completeSession } = useUserStats(MOCK_USER_STATS);

  const { timeLeft, isRunning, selectedTime, coffeePercentage, start, pause, setDuration } =
    useTimer({
      onComplete: (minutes) => completeSession(minutes),
    });

  const { tables, currentTableId, currentTableName, currentTableMembers, joinTable, leaveTable, createTable } =
    useTables({ setView });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleNavigate = useCallback((v: ViewKey) => {
    setView(v);
    setDrawerOpen(false);
  }, []);

  const handleMemberClick = useCallback((userName: string) => {
    setStatsModalUser(userName);
    setStatsModalData(MOCK_USER_STATS);
    setStatsModalOpen(true);
  }, []);

  const handleCreateTable = useCallback((name: string) => {
    createTable(name);
    setCreateTableOpen(false);
  }, [createTable]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div dir="rtl">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sidebar={
          <Sidebar
            items={MENU_ITEMS}
            activeView={view}
            onNavigate={handleNavigate}
          />
        }
      >
        <MobileNav onMenuOpen={() => setDrawerOpen(true)} />

        <div className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 flex flex-wrap gap-4 content-start">
          {view === "timer" && (
            <TimerView
              timeLeft={timeLeft}
              isRunning={isRunning}
              selectedTime={selectedTime}
              coffeePercentage={coffeePercentage}
              currentTableId={currentTableId}
              currentTableName={currentTableName}
              currentTableMembers={currentTableMembers}
              onStart={start}
              onPause={pause}
              onSetDuration={setDuration}
              onLeaveTable={leaveTable}
              onMemberClick={handleMemberClick}
            />
          )}

          {view === "tables" && (
            <TablesView
              tables={tables}
              onJoin={joinTable}
              onCreateClick={() => setCreateTableOpen(true)}
            />
          )}

          {view === "stats" && (
            <StatsView stats={stats} />
          )}
        </div>

        <BottomDock
          items={MENU_ITEMS}
          activeView={view}
          onNavigate={handleNavigate}
        />
      </Drawer>

      <CreateTableModal
        open={createTableOpen}
        onClose={() => setCreateTableOpen(false)}
        onCreate={handleCreateTable}
      />
      <StatsModal
        open={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        stats={statsModalData}
        userName={statsModalUser}
      />
    </div>
  );
}