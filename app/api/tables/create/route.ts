import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";
import { serialGenerator } from "@/app/api/lib/serialGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableName, creator } = body;

    if (!tableName || !creator) {
      return NextResponse.json(
        { success: false, msg: "نام میز و سازنده الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("Tables");

    const newTable = {
      id: serialGenerator(8),
      creator,
      tableName,
      members: [
        {
          name: creator,
          time: 0,
          isOnline: false,
          lastSeen: new Date().toISOString(),
        },
      ],
      date: new Date().toISOString(),
    };

    const res = await col.insertOne(newTable);

    if (res.acknowledged) {
      return NextResponse.json({
        success: true,
        msg: "میز با موفقیت ایجاد شد.",
        table: {
          id: newTable.id,
          creator: newTable.creator,
          tableName: newTable.tableName,
        },
      });
    }

    return NextResponse.json({ success: false, msg: "خطا در ایجاد میز" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
