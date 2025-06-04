
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const TransactionSchema = z.object({
  amount: z.number().positive({ message: 'จำนวนเงินต้องมากกว่า 0' }),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'ประเภทรายการไม่ถูกต้อง' }),
  category: z.string().min(1, { message: 'กรุณาเลือกหมวดหมู่' }),
  userId: z.string().cuid({ message: 'รหัสผู้ใช้ไม่ถูกต้อง' }),
});

export async function createTransactionAction(formData: FormData) {
  const rawFormData = {
    amount: parseFloat(formData.get('amount') as string),
    type: formData.get('type') as 'INCOME' | 'EXPENSE',
    category: formData.get('category') as string,
    userId: formData.get('userId') as string,
  };

  console.log('Raw form data received:', rawFormData);
  const validatedFields = TransactionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'ข้อมูลที่กรอกไม่ถูกต้อง',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { amount, type, category, userId } = validatedFields.data;

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return { success: false, message: 'ไม่พบผู้ใช้งานนี้' };
    }

    await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        userId,
      },
    });

    revalidatePath('/transactions');
    return { success: true, message: 'บันทึกรายการสำเร็จ' };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
  }
}
