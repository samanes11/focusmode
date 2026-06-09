import type { StudyTable, UserStats, MenuItem } from "@/types";

export const MOCK_TABLES: StudyTable[] = [
  {
    id: "1",
    name: "میز درس شبانه",
    creator: "علی",
    members: [
      { name: "علی",   img: "", isOnline: true,  todayMinutes: 120, time: 45 },
      { name: "سارا",  img: "", isOnline: true,  todayMinutes: 90,  time: 30 },
      { name: "رضا",   img: "", isOnline: false, todayMinutes: 60,  time: 0  },
    ],
  },
  {
    id: "2",
    name: "گروه کنکور",
    creator: "مریم",
    members: [
      { name: "مریم",  img: "", isOnline: true, todayMinutes: 200, time: 60 },
      { name: "کیان",  img: "", isOnline: true, todayMinutes: 150, time: 50 },
    ],
  },
  {
    id: "3",
    name: "دورهمی فریلنسرها",
    creator: "بهنام",
    members: [
      { name: "بهنام", img: "", isOnline: false, todayMinutes: 30, time: 0 },
    ],
  },
];

export const MOCK_USER_STATS: UserStats = {
  todayMinutes: 95,
  averageDaily: 72,
  record: 240,
  completedSessions: 12,
  weeklyStats: [
    { day: "شنبه",     minutes: 60  },
    { day: "یکشنبه",   minutes: 120 },
    { day: "دوشنبه",   minutes: 45  },
    { day: "سه‌شنبه",  minutes: 180 },
    { day: "چهارشنبه", minutes: 90  },
    { day: "پنجشنبه",  minutes: 200 },
    { day: "جمعه",     minutes: 95  },
  ],
};

export const MENU_ITEMS: MenuItem[] = [
  { key: "timer",  label: "تایمر", icon: "mdi:clock-outline"  },
  { key: "tables", label: "میزها", icon: "mdi:account-group"  },
  { key: "stats",  label: "آمار",  icon: "mdi:chart-bar"      },
];
