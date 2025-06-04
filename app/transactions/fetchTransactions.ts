import { prisma } from '@/lib/prisma'; // สมมติว่าคุณมี prisma client ที่ export ไว้

// Server Action หรือ Function สำหรับดึงรายการ Transaction ของผู้ใช้ที่ระบุ
export async function getUserTransactions(userId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId, // กรองรายการ Transaction เฉพาะของ User คนนี้
      },
      orderBy: {
        createdAt: 'desc', // เรียงลำดับตามเวลาสร้าง (ใหม่สุดอยู่บน)
      },
      // อาจจะเพิ่ม include: { user: true } ถ้าต้องการข้อมูลผู้ใช้ด้วย
    });
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการ' };
  }
}