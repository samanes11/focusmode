import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";

const PERSIAN_DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName");

    if (!userName) {
      return NextResponse.json(
        { success: false, msg: "userName الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("TimerSessions");

    const sessions = await col.find({ userName }).sort({ _id: -1 }).toArray();

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({
        success: true,
        stats: { todayMinutes: 0, averageDaily: 0, record: 0, weeklyStats: [], completedSessions: 0 },
        msg: "هنوز سشنی ثبت نشده است",
      });
    }

    // Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMinutes = sessions
      .filter((s) => {
        const d = new Date(s.completedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      })
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    // Weekly
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);

      const dayMinutes = sessions
        .filter((s) => {
          const d = new Date(s.completedAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === date.getTime();
        })
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      const dayIndex = date.getDay();
      const persianDayIndex = dayIndex === 6 ? 0 : dayIndex + 1;

      return { day: PERSIAN_DAYS[persianDayIndex], minutes: dayMinutes };
    });

    // Average
    const uniqueDays = new Set(
      sessions.map((s) => {
        const d = new Date(s.completedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const averageDaily = uniqueDays.size > 0 ? Math.round(totalMinutes / uniqueDays.size) : 0;

    // Record
    const dailyTotals = new Map<number, number>();
    sessions.forEach((s) => {
      const d = new Date(s.completedAt);
      d.setHours(0, 0, 0, 0);
      const key = d.getTime();
      dailyTotals.set(key, (dailyTotals.get(key) || 0) + s.durationMinutes);
    });
    const record = dailyTotals.size > 0 ? Math.max(...dailyTotals.values()) : 0;

    const completedSessions = sessions.filter((s) => s.isCompleted === true).length;

    return NextResponse.json({
      success: true,
      stats: { todayMinutes, averageDaily, record, weeklyStats, completedSessions },
      msg: "آمار با موفقیت بارگذاری شد.",
    });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
