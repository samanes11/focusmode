"use client";

import { useState, useCallback, useEffect } from "react";
import { useTimer, useUserStats } from "@/hooks/useTimer";
import { useTables } from "@/hooks/useTables";
import { MENU_ITEMS } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { apiGetUserStats } from "@/lib/api";

import Drawer from "@/components/Drawer";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import BottomDock from "@/components/layout/BottomDock";

import TimerView from "@/components/timer/TimerView";
import TablesView from "@/components/tables/TablesView";
import StatsView from "@/components/stats/StatsView";
import CreateTableModal from "@/components/tables/CreateTableModal";
import StatsModal from "@/components/stats/StatsModal";
import AuthModal from "@/components/auth/AuthModal";

import type { ViewKey, UserStats } from "@/types";

export default function CoffeeFocusPage() {
  const { user, loading: authLoading, logout } = useAuth();

  const [view, setView] = useState<ViewKey>("timer");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createTableOpen, setCreateTableOpen] = useState(false);

  // stats modal for other members
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsModalUser, setStatsModalUser] = useState("");
  const [statsModalData, setStatsModalData] = useState<UserStats | null>(null);

  // ── Hooks ───────────────────────────────────────────────────────────────────

  const userName = user?.userName ?? "";

  const { stats, statsLoading, fetchStats, completeSession } =
    useUserStats(userName);

  const {
    tables,
    tablesLoading,
    currentTableId,
    currentTableName,
    currentTableMembers,
    fetchTables,
    joinTable,
    leaveTable,
    createTable,
  } = useTables({ setView, userName });

  const {
    timeLeft,
    isRunning,
    selectedTime,
    coffeePercentage,
    start,
    pause,
    setDuration,
  } = useTimer({
    userName,
    tableId: currentTableId,
    onComplete: (minutes) => completeSession(minutes),
  });

  // ── Bootstrap ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (userName) {
      fetchStats();
      fetchTables();
    }
  }, [userName, fetchStats, fetchTables]);

  // Refresh tables when navigating to tables view
  useEffect(() => {
    if (view === "tables" && userName) fetchTables();
  }, [view, userName, fetchTables]);

  // Refresh stats when navigating to stats view
  useEffect(() => {
    if (view === "stats" && userName) fetchStats();
  }, [view, userName, fetchStats]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleNavigate = useCallback((v: ViewKey) => {
    setView(v);
    setDrawerOpen(false);
  }, []);

  const handleMemberClick = useCallback(async (memberName: string) => {
    setStatsModalUser(memberName);
    setStatsModalData(null);
    setStatsModalOpen(true);
    const data = await apiGetUserStats(memberName);
    if (data.success) setStatsModalData(data.stats);
  }, []);

  const handleCreateTable = useCallback(
    async (name: string) => {
      await createTable(name);
      setCreateTableOpen(false);
    },
    [createTable],
  );

  // ── Auth gate ────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#d4a574] text-lg">
        در حال بارگذاری...
      </div>
    );
  }

  if (!user) {
    return <AuthModal onSuccess={() => {}} />;
  }

  // ── Render ───────────────────────────────────────────────────────────────────

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
            userName={userName}
            onLogout={logout}
          />
        }
      >
        <MobileNav onMenuOpen={() => setDrawerOpen(true)} userName={userName} />

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
              loading={tablesLoading}
              onJoin={joinTable}
              onCreateClick={() => setCreateTableOpen(true)}
            />
          )}

          {view === "stats" && (
            <StatsView stats={stats} loading={statsLoading} />
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
