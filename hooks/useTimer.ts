"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { UserStats } from "@/types";
import { apiSaveSession, apiGetUserStats, apiUpdateTime } from "@/lib/api";

// ─── useTimer ─────────────────────────────────────────────────────────────────

interface UseTimerOptions {
  userName: string;
  tableId: string | null;
  onComplete: (minutesStudied: number) => void;
}

export function useTimer({ userName, tableId, onComplete }: UseTimerOptions) {
  const [timeLeft, setTimeLeft]         = useState(25 * 60);
  const [totalTime, setTotalTime]       = useState(25 * 60);
  const [isRunning, setIsRunning]       = useState(false);
  const [selectedTime, setSelectedTime] = useState(25);

  const intervalRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef       = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(0);
  const savedTimeRef       = useRef<number>(0);
  // track elapsed minutes synced to table
  const lastSyncedMinRef   = useRef<number>(0);

  const coffeePercentage = ((totalTime - timeLeft) / totalTime) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Save session + call parent callback
  const saveAndComplete = useCallback(
    async (durationSeconds: number, isCompleted: boolean) => {
      const minutes = Math.floor(durationSeconds / 60);
      if (minutes < 1) return;

      if (userName) {
        await apiSaveSession({
          userName,
          tableId,
          duration: durationSeconds,
          isCompleted,
          completedAt: new Date().toISOString(),
        }).catch(() => null);

        // Update session time in table member record
        if (tableId) {
          await apiUpdateTime(tableId, userName, minutes).catch(() => null);
        }
      }

      onComplete(minutes);
    },
    [userName, tableId, onComplete]
  );

  const start = useCallback(() => {
    if (isRunning) return;
    clearTimer();
    startTimeRef.current       = Date.now();
    initialTimeLeftRef.current = timeLeft;
    lastSyncedMinRef.current   = 0;
    setIsRunning(true);

    const interval = setInterval(() => {
      const elapsed     = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const newTimeLeft = Math.max(0, initialTimeLeftRef.current - elapsed);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(interval);
        intervalRef.current  = null;
        savedTimeRef.current = 0;
        setIsRunning(false);
        toast.success("بسه دیگه وقت چیل کردنه ☕");
        saveAndComplete(initialTimeLeftRef.current, true);
      }
    }, 1000);

    intervalRef.current = interval;
  }, [isRunning, timeLeft, clearTimer, saveAndComplete]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();

    if (startTimeRef.current) {
      const elapsed     = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, initialTimeLeftRef.current - elapsed);
      setTimeLeft(newTimeLeft);

      const timeSpent      = totalTime - newTimeLeft;
      const unsavedSeconds = timeSpent - savedTimeRef.current;

      if (unsavedSeconds >= 60) {
        savedTimeRef.current = timeSpent;
        const mins = Math.floor(unsavedSeconds / 60);
        toast.success(`${mins} دقیقه برای شما ثبت شد`);
        saveAndComplete(unsavedSeconds, false);
      }
    }
  }, [clearTimer, totalTime, saveAndComplete]);

  const setDuration = useCallback((minutes: number) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setTotalTime(minutes * 60);
    setIsRunning(false);
    savedTimeRef.current = 0;
    clearTimer();
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { timeLeft, totalTime, isRunning, selectedTime, coffeePercentage, start, pause, setDuration };
}

// ─── useUserStats ─────────────────────────────────────────────────────────────

const EMPTY_STATS: UserStats = {
  todayMinutes: 0,
  averageDaily: 0,
  record: 0,
  completedSessions: 0,
  weeklyStats: [],
};

export function useUserStats(userName: string) {
  const [stats, setStats]       = useState<UserStats>(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!userName) return;
    setStatsLoading(true);
    try {
      const data = await apiGetUserStats(userName);
      if (data.success) setStats(data.stats);
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  }, [userName]);

  // Optimistic update when a session completes
  const addMinutes = useCallback((minutes: number) => {
    setStats((prev) => ({ ...prev, todayMinutes: prev.todayMinutes + minutes }));
  }, []);

  const completeSession = useCallback((minutes: number) => {
    setStats((prev) => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      todayMinutes: prev.todayMinutes + minutes,
    }));
    // Re-fetch for accurate record/average after a short delay
    setTimeout(fetchStats, 1500);
  }, [fetchStats]);

  return { stats, statsLoading, fetchStats, addMinutes, completeSession };
}