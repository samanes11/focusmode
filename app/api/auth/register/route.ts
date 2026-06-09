import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";
import { serialGenerator } from "@/app/api/lib/serialGenerator";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, password } = body;

    if (!userName || !password) {
      return NextResponse.json(
        { success: false, msg: "نام کاربری و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    if (userName.trim().length < 3) {
      return NextResponse.json(
        { success: false, msg: "نام کاربری باید حداقل ۳ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, msg: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("Users");

    // Check duplicate username
    const existing = await col.findOne({ userName: userName.trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, msg: "این نام کاربری قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: serialGenerator(8),
      userName: userName.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const res = await col.insertOne(newUser);

    if (res.acknowledged) {
      return NextResponse.json({
        success: true,
        msg: "ثبت‌نام با موفقیت انجام شد",
        user: {
          id: newUser.id,
          userName: newUser.userName,
        },
      });
    }

    return NextResponse.json(
      { success: false, msg: "خطا در ثبت‌نام" },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, msg: "خطای سرور: " + e },
      { status: 500 }
    );
  }
}
