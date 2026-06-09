"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { UserStats } from "@/types";

interface UseTimerOptions {
  onComplete: (minutesStudied: number) => void;
}

export function useTimer({ onComplete }: UseTimerOptions) {
  const [timeLeft, setTimeLeft]         = useState(25 * 60);
  const [totalTime, setTotalTime]       = useState(25 * 60);
  const [isRunning, setIsRunning]       = useState(false);
  const [selectedTime, setSelectedTime] = useState(25);

  const intervalRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef       = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(0);
  const savedTimeRef       = useRef<number>(0);

  const coffeePercentage = ((totalTime - timeLeft) / totalTime) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    clearTimer();
    startTimeRef.current       = Date.now();
    initialTimeLeftRef.current = timeLeft;
    setIsRunning(true);

    const interval = setInterval(() => {
      const elapsed    = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const newTimeLeft = Math.max(0, initialTimeLeftRef.current - elapsed);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(interval);
        intervalRef.current    = null;
        savedTimeRef.current   = 0;
        setIsRunning(false);
        toast.success("بسه دیگه وقت چیل کردنه ☕");
        onComplete(Math.floor(initialTimeLeftRef.current / 60));
      }
    }, 1000);

    intervalRef.current = interval;
  }, [isRunning, timeLeft, clearTimer, onComplete]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();

    if (startTimeRef.current) {
      const elapsed     = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, initialTimeLeftRef.current - elapsed);
      setTimeLeft(newTimeLeft);

      const timeSpent       = totalTime - newTimeLeft;
      const unsavedMinutes  = Math.floor((timeSpent - savedTimeRef.current) / 60);

      if (unsavedMinutes >= 1) {
        savedTimeRef.current = timeSpent;
        toast.success(`${unsavedMinutes.toLocaleString("fa-IR")} دقیقه برای شما ثبت شد`);
        onComplete(unsavedMinutes);
      }
    }
  }, [clearTimer, totalTime, onComplete]);

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

export function useUserStats(initial: UserStats) {
  const [stats, setStats] = useState<UserStats>(initial);

  const addMinutes = useCallback((minutes: number) => {
    setStats(prev => ({ ...prev, todayMinutes: prev.todayMinutes + minutes }));
  }, []);

  const completeSession = useCallback((minutes: number) => {
    setStats(prev => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      todayMinutes: prev.todayMinutes + minutes,
    }));
  }, []);

  return { stats, addMinutes, completeSession };
}
