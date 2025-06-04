"use server";

import { prisma } from "@/lib/prisma"; // ✅ ใช้ Prisma instance จาก lib
import bcrypt from "bcryptjs";

// const prisma = new PrismaClient(); // ❌ ลบการสร้าง instance ใหม่ที่นี่

export async function RegisterUser(
  username: string,
  password_arg: string
): Promise<{ success: boolean; message: string }> {
  try {
    // ตรวจสอบว่าชื่อผู้ใช้นี้มีอยู่ในระบบแล้วหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { success: false, message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" };
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password_arg, 10);

    // สร้างผู้ใช้ใหม่
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return { success: true, message: "สมัครสมาชิกสำเร็จ" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    };
  } finally {
    // await prisma.$disconnect(); // ❌ ไม่จำเป็นเมื่อใช้ singleton instance
  }
}