import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    // This case should ideally be caught by Next.js routing if userId is a required segment,
    // but it's good for robustness.
    return NextResponse.json(
      { success: false, message: 'User ID parameter is missing' },
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

    // Consider what to return if no transactions are found or user doesn't exist
    // For now, just returning the (potentially empty) array of transactions
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(`Error fetching transactions for user ${userId}:`, error);
    let errorMessage = 'An unexpected error occurred while fetching transactions.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, message: 'Error fetching transactions', error: errorMessage },
      { status: 500 }
    );
  }
}