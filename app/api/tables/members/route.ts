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
        { success: false, msg: "میز مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = await sessionsCol
      .find({ tableId, completedAt: { $gte: today.toISOString() } })
      .toArray();

    const todayStats: Record<string, number> = {};
    todaySessions.forEach((session) => {
      const { userName, durationMinutes = 0 } = session;
      todayStats[userName] = (todayStats[userName] || 0) + durationMinutes;
    });

    const membersWithStats = (table.members || [])
      .map((member: any) => ({
        ...member,
        todayMinutes: todayStats[member.name] || 0,
      }))
      .sort((a: any, b: any) => b.todayMinutes - a.todayMinutes);

    return NextResponse.json({
      success: true,
      members: membersWithStats,
      tableName: table.tableName,
    });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
