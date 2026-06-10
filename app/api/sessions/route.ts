import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";
import { serialGenerator } from "@/app/api/lib/serialGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, tableId, duration, isCompleted, completedAt } = body;

    if (!userName || duration === undefined || !completedAt) {
      return NextResponse.json(
        { success: false, msg: "پارامترهای ضروری وجود ندارد" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("TimerSessions");

    const newSession = {
      id: serialGenerator(8),
      userName,
      tableId: tableId ?? null,
      duration,
      durationMinutes: Math.floor(duration / 60),
      isCompleted,
      completedAt,
    };

    const res = await col.insertOne(newSession);

    if (res.acknowledged) {
      return NextResponse.json({
        success: true,
        msg: "سشن با موفقیت ذخیره شد.",
        session: newSession,
      });
    }

    return NextResponse.json({ success: false, msg: "خطا در ذخیره سشن" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}