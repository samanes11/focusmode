export interface WeeklyStat {
  day: string;
  minutes: number;
}

export interface UserStats {
  todayMinutes: number;
  averageDaily: number;
  record: number;
  weeklyStats: WeeklyStat[];
  completedSessions: number;
}

export interface TableMember {
  name: string;
  img: string;
  isOnline: boolean;
  todayMinutes: number;
  time: number;
}

export interface StudyTable {
  id: string;
  name: string;
  creator: string;
  members: TableMember[];
}

export type ViewKey = "timer" | "tables" | "stats";

export interface MenuItem {
  key: ViewKey;
  label: string;
  icon: string;
}
