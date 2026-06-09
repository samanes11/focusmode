import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tableId = searchParams.get("tableId");

    if (!tableId) {
      return NextResponse.json(
        { success: false, msg: "tableId الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const tablesCol = db.collection("Tables");
    const sessionsCol = db.collection("TimerSessions");

    const table = await tablesCol.findOne({ id: tableId });
    if (!table) {
      return NextResponse.json(
        { success: false, msg: "میز مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = await sessionsCol
      .find({ tableId, completedAt: { $gte: today.toISOString() } })
      .toArray();

    const userStats: Record<string, number> = {};
    todaySessions.forEach((session) => {
      const { userName, durationMinutes = 0 } = session;
      userStats[userName] = (userStats[userName] || 0) + durationMinutes;
    });

    const stats = Object.entries(userStats)
      .map(([userName, todayMinutes]) => ({ userName, todayMinutes }))
      .sort((a, b) => b.todayMinutes - a.todayMinutes)
      .map((stat, index) => ({ ...stat, rank: index + 1 }));

    return NextResponse.json({
      success: true,
      stats,
      tableName: table.tableName,
    });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
