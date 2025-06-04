import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password: password_arg } = body;

    if (!username || !password_arg) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" },
        { status: 409 } // 409 Conflict
      );
    }

    const hashedPassword = await bcrypt.hash(password_arg, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { success: true, message: "สมัครสมาชิกสำเร็จ" },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}