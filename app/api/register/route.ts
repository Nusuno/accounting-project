"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";



export async function RegisterUser(
  username: string,
  password_arg: string
): Promise<{ success: boolean; message: string }> {
  try {

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { success: false, message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" };
    }


    const hashedPassword = await bcrypt.hash(password_arg, 10);


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

  }
}