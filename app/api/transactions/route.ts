import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const TransactionSchema = z.object({
  amount: z.number().positive({ message: 'จำนวนเงินต้องมากกว่า 0' }),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'ประเภทรายการไม่ถูกต้อง' }),
  category: z.string().min(1, { message: 'กรุณาเลือกหมวดหมู่' }),
  userId: z.string().cuid({ message: 'รหัสผู้ใช้ไม่ถูกต้อง' }),
});

export async function POST(request: Request) {
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Error parsing FormData:', error);
    return NextResponse.json(
      { success: false, message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (Invalid FormData)' },
      { status: 400 }
    );
  }

  const rawFormData = {
    amount: parseFloat(formData.get('amount') as string),
    type: formData.get('type') as 'INCOME' | 'EXPENSE',
    category: formData.get('category') as string,
    userId: formData.get('userId') as string,
  };
  console.log('Raw form data received in API route:', rawFormData);
  const validatedFields = TransactionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Validation errors in API route:', validatedFields.error.flatten().fieldErrors);
    return NextResponse.json(
      {
        success: false,
        message: 'ข้อมูลที่กรอกไม่ถูกต้อง',
        errors: validatedFields.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { amount, type, category, userId } = validatedFields.data;

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งานนี้' },
        { status: 404 } // Not Found
      );
    }

    await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        userId,
      },
    });
    revalidatePath('/transactions'); // Revalidate client-side cache if needed
    revalidatePath('/summary'); // Also revalidate summary page
    return NextResponse.json(
      { success: true, message: 'บันทึกรายการสำเร็จ' },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('Error creating transaction in API route:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 } // Internal Server Error
    );
  }
}

// If you need to fetch transactions via this route as well, you can add a GET handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'จำเป็นต้องมีรหัสผู้ใช้ (userId is required)' },
      { status: 400 }
    );
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
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions in API route:", error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการ' },
      { status: 500 }
    );
  }
}
