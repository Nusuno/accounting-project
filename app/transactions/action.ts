'use server'

import { TransactionType } from '@prisma/client'
import { prisma } from '@/lib/prisma'; // ✅ ใช้ Prisma instance จาก lib
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema สำหรับตรวจสอบความถูกต้องของข้อมูล Transaction
const CreateTransactionSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'จำนวนเงินต้องเป็นตัวเลข' })
    .positive({ message: 'จำนวนเงินต้องมากกว่า 0' }),
  type: z.nativeEnum(TransactionType, { // ใช้ nativeEnum สำหรับ enum จาก Prisma
    errorMap: () => ({ message: 'ประเภทรายการไม่ถูกต้อง (ต้องเป็น INCOME หรือ EXPENSE)' }),
  }),
  // title: z.string().min(1, { message: 'ชื่อรายการต้องไม่ว่างเปล่า' }), // ลบ title ออกจาก schema
  category: z.string().min(1, { message: 'หมวดหมู่ต้องไม่ว่างเปล่า' }),
})

export async function createTransactionAction(formData: FormData) {
  const validatedFields = CreateTransactionSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'), // ค่าที่ได้จาก FormData จะเป็น string, Prisma จะจัดการแปลงให้ถ้า type ตรงกับ enum
    // title: formData.get('title'), // ลบการดึง title จาก formData
    category: formData.get('category'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลที่กรอก',
    }
  }

  const { amount, type, category } = validatedFields.data // ลบ title ออกจาก destructuring

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        // title, // ลบ title ในการสร้าง transaction
        category,
      },
    })
    revalidatePath('/transactions') // ปรับ path นี้ตามหน้าที่แสดงรายการธุรกรรมของคุณ
    return { success: true, message: 'บันทึกรายการสำเร็จ!', data: newTransaction }
  } catch (error) {
    console.error("🔴 [Transaction Action Error] Failed to create transaction:", error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาด: ไม่สามารถบันทึกรายการลงฐานข้อมูลได้ (โปรดตรวจสอบ Log ของ Server สำหรับรายละเอียดเพิ่มเติม)'
    }
  }
}
