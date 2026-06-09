import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableId, userName } = body;

    if (!tableId || !userName) {
      return NextResponse.json(
        { success: false, msg: "tableId و userName الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("Tables");

    const table = await col.findOne({ id: tableId });
    if (!table) {
      return NextResponse.json(
        { success: false, msg: "میز یافت نشد" },
        { status: 404 }
      );
    }

    const updatedMembers = table.members.map((m: any) =>
      m.name === userName
        ? { ...m, isOnline: false, lastSeen: new Date().toISOString() }
        : m
    );

    await col.updateOne({ id: tableId }, { $set: { members: updatedMembers } });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
