import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/waiters/petty-cash - Get petty cash records for today
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const waiterId = searchParams.get('waiterId');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await prisma.waiterPettyCash.findMany({
      where: {
        ...(waiterId && { waiterId }),
        createdAt: { gte: today },
      },
      include: {
        waiter: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching petty cash:', error);
    return NextResponse.json(
      { error: 'Failed to fetch petty cash records' },
      { status: 500 }
    );
  }
}

// POST /api/waiters/petty-cash - Issue petty cash float to a waiter
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { waiterId, amount, givenBy, notes } = body;

    if (!waiterId || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Valid waiter and positive amount are required' },
        { status: 400 }
      );
    }

    const record = await prisma.waiterPettyCash.create({
      data: {
        waiterId,
        amount: Number(amount),
        givenBy: givenBy || 'Cashier',
        notes: notes || null,
      },
      include: {
        waiter: true,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error adding petty cash:', error);
    return NextResponse.json(
      { error: 'Failed to record petty cash' },
      { status: 500 }
    );
  }
}
