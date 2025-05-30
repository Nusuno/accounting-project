'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveTransaction(formData: FormData, userId: string) {
  try {
    const rawType = formData.get('type') as string;
    const rawAmount = formData.get('amount') as string;

    const amount = parseFloat(rawAmount);
    const title = rawType === 'รายรับ' ? 'รายรับ' : 'รายจ่าย';
    const category = 'ทั่วไป';

    // !!! ต้องให้ userId ตรงกับ User ในฐานข้อมูล !!!
    if (!rawType || isNaN(amount) || amount <= 0) {
      throw new Error('ข้อมูลไม่ถูกต้อง');
    }

    // แปลงจากข้อความไทย → ENUM ที่ Prisma รองรับ
    const enumType = rawType === 'รายรับ' ? 'INCOME' : 'EXPENSE';

    // ตรวจว่า user มีอยู่จริง
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      throw new Error('ไม่พบผู้ใช้งานในระบบ');
    }

    await prisma.transaction.create({
      data: {
        title,
        amount,
        type: enumType,
        category,
        userId,
      },
    });

    revalidatePath('/transactions');

  } catch (err: any) {
    console.error('❌ ERROR while saving transaction:', err);
    throw new Error(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
}
