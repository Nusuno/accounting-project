import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ success: false, message: 'จำเป็นต้องมีรหัสผู้ใช้' }, { status: 400 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // คืนค่าข้อมูลรายการโดยตรงเพื่อให้ client จัดการได้ง่าย
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการ' }, { status: 500 });
  }
}
