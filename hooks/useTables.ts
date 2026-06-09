"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { StudyTable, TableMember, ViewKey } from "@/types";
import {
  apiGetTables,
  apiCreateTable,
  apiJoinTable,
  apiLeaveTable,
  apiSetOnline,
  apiGetTableMembers,
} from "@/lib/api";

interface UseTablesOptions {
  setView: (view: ViewKey) => void;
  userName: string;
}

export function useTables({ setView, userName }: UseTablesOptions) {
  const [tables, setTables]                           = useState<StudyTable[]>([]);
  const [tablesLoading, setTablesLoading]             = useState(false);
  const [currentTableId, setCurrentTableId]           = useState<string | null>(null);
  const [currentTableName, setCurrentTableName]       = useState("");
  const [currentTableMembers, setCurrentTableMembers] = useState<TableMember[]>([]);

  // ── Poll members every 10s when inside a table ─────────────────────────────
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback((tableId: string) => {
    stopPolling();
    const refresh = async () => {
      const data = await apiGetTableMembers(tableId);
      if (data.success) {
        setCurrentTableMembers(
          data.members
            .filter((m) => m.isOnline)
            .map((m) => ({
              name: m.name,
              img: m.img,
              isOnline: m.isOnline,
              todayMinutes: m.todayMinutes,
              time: m.time,
            }))
        );
      }
    };
    refresh();
    pollRef.current = setInterval(refresh, 10_000);
  }, [stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  // ── Fetch all tables ────────────────────────────────────────────────────────
  const fetchTables = useCallback(async () => {
    setTablesLoading(true);
    try {
      const data = await apiGetTables();
      if (data.success) {
        setTables(
          data.tables.map((t) => ({
            id: t.id,
            name: t.name,
            creator: t.creator,
            members: t.members.map((m) => ({
              name: m.name,
              img: m.img ?? "",
              isOnline: m.isOnline ?? false,
              todayMinutes: m.todayMinutes ?? 0,
              time: m.time ?? 0,
            })),
          }))
        );
      }
    } catch {
      toast.error("خطا در بارگذاری میزها");
    } finally {
      setTablesLoading(false);
    }
  }, []);

  // ── Join ────────────────────────────────────────────────────────────────────
  const joinTable = useCallback(async (tableId: string) => {
    if (!userName) { toast.error("ابتدا وارد شو"); return; }
    const data = await apiJoinTable(tableId, userName);
    if (!data.success) { toast.error(data.msg); return; }

    const t = data.table!;
    setCurrentTableId(tableId);
    setCurrentTableName(t.name);
    setCurrentTableMembers(
      t.members
        .filter((m) => m.isOnline)
        .map((m) => ({ name: m.name, img: m.img ?? "", isOnline: true, todayMinutes: m.todayMinutes ?? 0, time: m.time ?? 0 }))
    );
    startPolling(tableId);
    setView("timer");
    toast.success("به میز پیوستید! ☕");
  }, [userName, setView, startPolling]);

  // ── Leave ───────────────────────────────────────────────────────────────────
  const leaveTable = useCallback(async () => {
    if (currentTableId && userName) {
      await apiLeaveTable(currentTableId, userName).catch(() => null);
    }
    stopPolling();
    setCurrentTableId(null);
    setCurrentTableMembers([]);
    setCurrentTableName("");
    setView("tables");
    toast.info("از میز خارج شدید");
  }, [currentTableId, userName, setView, stopPolling]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const createTable = useCallback(async (name: string) => {
    if (!userName) { toast.error("ابتدا وارد شو"); return; }
    const data = await apiCreateTable(name, userName);
    if (data.success) {
      toast.success("میز با موفقیت ایجاد شد!");
      fetchTables();
    } else {
      toast.error(data.msg);
    }
  }, [userName, fetchTables]);

  // ── Mark online when view switches to timer ─────────────────────────────────
  const markOnline = useCallback(async (tableId: string) => {
    if (!userName) return;
    await apiSetOnline(tableId, userName).catch(() => null);
  }, [userName]);

  return {
    tables,
    tablesLoading,
    currentTableId,
    currentTableName,
    currentTableMembers,
    fetchTables,
    joinTable,
    leaveTable,
    createTable,
    markOnline,
  };
}