import { prisma } from '@/lib/prisma';


export async function getUserTransactions(userId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },

    });
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการ' };
  }
}