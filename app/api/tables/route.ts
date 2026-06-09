import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const col = db.collection("Tables");

    const tables = await col.find({}).sort({ _id: -1 }).toArray();

    const formattedTables = tables.map((table) => ({
      id: table.id,
      name: table.tableName,
      creator: table.creator,
      members: table.members || [{ name: table.creator, time: 0 }],
      createdAt: table.date,
    }));

    return NextResponse.json({
      success: true,
      tables: formattedTables,
      msg: "میزها با موفقیت بارگذاری شدند",
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, tables: [], msg: "خطای سرور: " + e },
      { status: 500 }
    );
  }
}
