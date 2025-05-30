<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { title, amount, type, category } = body;

    if (!title || !amount || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // แปลง amount เป็น number ถ้าเป็น string
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
      if (isNaN(amount)) {
        return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 });
      }
    }

    // ถ้า category เป็น object ให้ใช้ category.name หรือ category.id
    if (typeof category === 'object' && category !== null) {
      category = category.name || category.id || '';
    }

    const userId = 'demo-user-id'; // 🔒 แก้ภายหลังเมื่อมีระบบ login

    
   const [transaction] = await prisma.$transaction([
  prisma.transaction.create({
    data: {
      title,
      amount,
      type,
      category,
      userId,
    }
  }),
]);



    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
=======
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const userId = 'demo-user-id'; // ภายหลังให้ใช้ user ที่ login อยู่

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(transactions);
>>>>>>> b7b3c03136bb851dedf8e78730ba767a99bbec0a
}
