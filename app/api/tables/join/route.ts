import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableId, userName, userImg = "" } = body;

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
        { success: false, msg: "میز مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    const members = table.members || [{ name: table.creator, time: 0 }];
    const existingMember = members.find((m: any) => m.name === userName);

    let updatedMembers;

    if (existingMember) {
      updatedMembers = members.map((m: any) =>
        m.name === userName
          ? { ...m, time: 0, isOnline: true, lastSeen: new Date().toISOString() }
          : m
      );
    } else {
      updatedMembers = [
        ...members,
        {
          name: userName,
          img: userImg,
          time: 0,
          isOnline: true,
          lastSeen: new Date().toISOString(),
        },
      ];
    }

    await col.updateOne({ id: tableId }, { $set: { members: updatedMembers } });

    return NextResponse.json({
      success: true,
      msg: "با موفقیت به میز پیوستید",
      table: {
        id: table.id,
        name: table.tableName,
        creator: table.creator,
        members: updatedMembers,
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, msg: "خطای سرور: " + e }, { status: 500 });
  }
}
