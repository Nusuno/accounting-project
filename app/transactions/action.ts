'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
// import { db } from '@/lib/db'; // ปรับตามการเชื่อมต่อฐานข้อมูลของคุณ เช่น Prisma หรืออื่น ๆ

// สร้าง schema สำหรับตรวจสอบข้อมูลจากฟอร์ม
const transactionSchema = z.object({
  type: z.enum(['รายรับ', 'รายจ่าย']),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'จำนวนเงินไม่ถูกต้อง',
  }),
  category: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
});

export async function saveTransaction(formData: FormData) {
  const rawData = {
    type: formData.get('type') as string,
    amount: formData.get('amount') as string,
    category: formData.get('category') as string,
  };

  const result = transactionSchema.safeParse(rawData);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { type, amount, category } = result.data;

  // 🔁 ตัวอย่าง mock database call – แทนที่ด้วยการบันทึกจริงในระบบของคุณ
  const newTransaction = {
    id: Date.now(),
    type,
    category,
    amount: parseFloat(amount),
    createdAt: new Date().toISOString(),
  };

  // ตัวอย่าง: บันทึกลง DB จริง (เช่น Prisma)
  /*
  await db.transaction.create({
    data: {
      userId: ..., // ดึงจาก session หรือ context
      type,
      category,
      amount: parseFloat(amount),
    },
  });
  */

  console.log('💾 บันทึกรายการ:', newTransaction);

  // ถ้าต้องการให้ refresh UI ที่ใช้ข้อมูลนี้
  revalidatePath('/transactions'); // หรือเส้นทางที่มีการแสดงข้อมูล

  return { success: true };
}
