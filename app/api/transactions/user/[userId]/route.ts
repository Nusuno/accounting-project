import { NextRequest, NextResponse } from 'next/server';
import { getUserTransactions } from '../../../../transactions/fetchTransactions';

export async function GET(
  request: NextRequest, // เปลี่ยนจาก Request เป็น NextRequest
  context: { params: { userId: string } } // ใช้ context object โดยตรง
) {
  const userId = context.params.userId; // ดึง userId จาก context.params

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'User ID parameter is missing' },
      { status: 400 }
    );
  }
  try {
    const result = await getUserTransactions(userId);

    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      // ใช้ message จาก getUserTransactions หรือ fallback message
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to fetch transactions' },
        { status: 500 } // หรือ 404 หาก result.message บ่งชี้ว่าไม่พบข้อมูล
      );
    }
  } catch (error) {
    // Error นี้เกิดขึ้นหากมีปัญหาใน API route handler เอง, ไม่ใช่ภายใน getUserTransactions
    console.error(`API route error for user ${userId}:`, error);
    return NextResponse.json(
      { success: false, message: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}