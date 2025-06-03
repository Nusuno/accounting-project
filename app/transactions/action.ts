import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType, User } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, amount, type, category } = body;

    // --- การจัดการ User ID ---
    // ในแอปพลิเคชันจริง คุณจะต้องดึง userId จาก session ของผู้ใช้ที่ล็อกอินอยู่
    // หรือจาก token ที่ส่งมากับ request
    // ตัวอย่าง (สมมติว่าคุณมี logic การดึง userId ที่ปลอดภัย):
    // const userId = await getUserIdFromRequest(req);
    // if (!userId) {
    //   return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    // }
    const userId = "demo-user-id"; // <<!>> แทนที่ด้วย Logic การดึง User ID จริง

    // Basic validation
    if (!title || amount === undefined || !type || !category) {
      return NextResponse.json(
        { message: "Missing required fields: title, amount, type, category" },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a valid positive number." },
        { status: 400 }
      );
    }

    if (!Object.values(TransactionType).includes(type as TransactionType)) {
      return NextResponse.json(
        { message: "Invalid transaction type." },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า User ที่ระบุมีอยู่จริง (optional, but good practice)
    const userExists: User | null = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ message: `User with ID ${userId} not found.` }, { status: 404 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: numericAmount,
        type: type as TransactionType,
        category,
        userId,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างรายการ", error: errorMessage },
      { status: 500 });
  }
}
