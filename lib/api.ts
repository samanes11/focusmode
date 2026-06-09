// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiTable {
  id: string;
  name: string;
  creator: string;
  members: ApiMember[];
  createdAt?: string;
}

export interface ApiMember {
  name: string;
  img: string;
  isOnline: boolean;
  todayMinutes: number;
  time: number;
  lastSeen?: string;
}

export interface ApiStats {
  todayMinutes: number;
  averageDaily: number;
  record: number;
  weeklyStats: { day: string; minutes: number }[];
  completedSessions: number;
}

export interface ApiUser {
  id: string;
  userName: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiRegister(userName: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  return res.json() as Promise<{ success: boolean; msg: string; user?: ApiUser }>;
}

export async function apiLogin(userName: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  return res.json() as Promise<{ success: boolean; msg: string; user?: ApiUser }>;
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export async function apiGetTables() {
  const res = await fetch("/api/tables");
  return res.json() as Promise<{ success: boolean; tables: ApiTable[]; msg: string }>;
}

export async function apiCreateTable(tableName: string, creator: string) {
  const res = await fetch("/api/tables/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableName, creator }),
  });
  return res.json() as Promise<{ success: boolean; msg: string; table?: { id: string; creator: string; tableName: string } }>;
}

export async function apiJoinTable(tableId: string, userName: string, userImg = "") {
  const res = await fetch("/api/tables/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, userName, userImg }),
  });
  return res.json() as Promise<{ success: boolean; msg: string; table?: ApiTable }>;
}

export async function apiLeaveTable(tableId: string, userName: string) {
  const res = await fetch("/api/tables/leave", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, userName }),
  });
  return res.json() as Promise<{ success: boolean; msg?: string }>;
}

export async function apiSetOnline(tableId: string, userName: string) {
  const res = await fetch("/api/tables/online", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, userName }),
  });
  return res.json() as Promise<{ success: boolean }>;
}

export async function apiUpdateTime(tableId: string, userName: string, timeMinutes: number) {
  const res = await fetch("/api/tables/time", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, userName, timeMinutes }),
  });
  return res.json() as Promise<{ success: boolean; msg?: string; members?: ApiMember[] }>;
}

export async function apiGetTableMembers(tableId: string) {
  const res = await fetch(`/api/tables/members?tableId=${tableId}`);
  return res.json() as Promise<{ success: boolean; members: ApiMember[]; tableName: string }>;
}

export async function apiGetTableStats(tableId: string) {
  const res = await fetch(`/api/tables/stats?tableId=${tableId}`);
  return res.json() as Promise<{ success: boolean; stats: { userName: string; todayMinutes: number; rank: number }[]; tableName: string }>;
}

// ─── User Stats ───────────────────────────────────────────────────────────────

export async function apiGetUserStats(userName: string) {
  const res = await fetch(`/api/stats?userName=${encodeURIComponent(userName)}`);
  return res.json() as Promise<{ success: boolean; stats: ApiStats; msg: string }>;
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function apiSaveSession(payload: {
  userName: string;
  tableId?: string | null;
  duration: number;
  isCompleted: boolean;
  completedAt: string;
}) {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<{ success: boolean; msg: string }>;
}
