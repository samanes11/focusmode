import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableId, userName, timeMinutes } = body;

    if (!tableId || !userName || timeMinutes === undefined) {
      return NextResponse.json(
        { success: false, msg: "پارامترهای ضروری وجود ندارد" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("Tables");

    const table = await col.findOne({ id: tableId });
    if (!table) {
      return NextResponse.json(
        { success: false, msg: "میز مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const updatedMembers = (table.members || []).map((m: any) =>
      m.name === userName ? { ...m, time: timeMinutes } : m
    );

    await col.updateOne({ id: tableId }, { $set: { members: updatedMembers } });

    return NextResponse.json({
      success: true,
      msg: "زمان با موفقیت آپدیت شد",
      members: updatedMembers,
    });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
