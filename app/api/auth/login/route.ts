import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/api/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

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

    const db = await getDb();
    const col = db.collection("Users");

    const user = await col.findOne({ userName: userName.trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, msg: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, msg: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await new SignJWT({ id: user.id, userName: user.userName })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      msg: "ورود با موفقیت انجام شد",
      user: {
        id: user.id,
        userName: user.userName,
      },
    });

    // Set token as httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (e) {
    return NextResponse.json(
      { success: false, msg: "خطای سرور: " + e },
      { status: 500 }
    );
  }
}
