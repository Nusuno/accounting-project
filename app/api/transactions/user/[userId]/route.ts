import { type NextRequest, NextResponse } from 'next/server'; // แนะนำให้ใช้ type import
import { getUserTransactions } from '../../../../transactions/fetchTransactions';

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any // ใช้ any และปิด ESLint rule สำหรับบรรทัดนี้
) {
  // ตรวจสอบโครงสร้างของ context และ params ในขณะ runtime เนื่องจากใช้ any
  // และเพื่อให้แน่ใจว่า userId เป็น string
  if (
    !context ||
    typeof context !== 'object' ||
    !context.params ||
    typeof context.params !== 'object' ||
    typeof context.params.userId !== 'string' ||
    context.params.userId.trim() === ''
  ) {
    return NextResponse.json(
      { success: false, message: 'User ID parameter is missing or invalid' },
      { status: 400 }
    );
  }
  const userId: string = context.params.userId;

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