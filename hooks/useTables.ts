"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { StudyTable, TableMember, ViewKey } from "@/types";
import { MOCK_TABLES } from "@/data/mock";

interface UseTablesOptions {
  setView: (view: ViewKey) => void;
}

export function useTables({ setView }: UseTablesOptions) {
  const [tables, setTables]                     = useState<StudyTable[]>(MOCK_TABLES);
  const [currentTableId, setCurrentTableId]     = useState<string | null>(null);
  const [currentTableName, setCurrentTableName] = useState("");
  const [currentTableMembers, setCurrentTableMembers] = useState<TableMember[]>([]);

  const joinTable = useCallback((tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    setCurrentTableId(tableId);
    setCurrentTableName(table.name);
    setCurrentTableMembers(table.members.filter(m => m.isOnline));
    setView("timer");
    toast.success("به میز پیوستید!");
  }, [tables, setView]);

  const leaveTable = useCallback(() => {
    setCurrentTableId(null);
    setCurrentTableMembers([]);
    setCurrentTableName("");
    setView("tables");
    toast.info("از میز خارج شدید");
  }, [setView]);

  const createTable = useCallback((name: string) => {
    const newTable: StudyTable = {
      id: Date.now().toString(),
      name,
      creator: "شما",
      members: [{ name: "شما", img: "", isOnline: true, todayMinutes: 0, time: 0 }],
    };
    setTables(prev => [...prev, newTable]);
    toast.success("میز با موفقیت ایجاد شد!");
  }, []);

  return { tables, currentTableId, currentTableName, currentTableMembers, joinTable, leaveTable, createTable };
}
