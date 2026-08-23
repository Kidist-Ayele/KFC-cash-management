import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Shift } from '@prisma/client';

// GET /api/cashier-shifts/current - Get or verify active shift for a cashier
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cashierId = searchParams.get('cashierId');

    // Find the latest active shift
    const activeShift = await prisma.cashierShift.findFirst({
      where: {
        ...(cashierId ? { cashierId } : {}),
        status: 'ACTIVE',
      },
      orderBy: { startedAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(activeShift);
  } catch (error) {
    console.error('Error fetching active shift:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active shift' },
      { status: 500 }
    );
  }
}

// POST /api/cashier-shifts/start - Start a shift with beginning cash
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cashierId, beginningCash, shiftType } = body;

    let targetUser = null;
    if (cashierId) {
      targetUser = await prisma.user.findUnique({ where: { id: cashierId } });
    }
    if (!targetUser) {
      targetUser = await prisma.user.findFirst({ where: { role: 'CASHIER' } }) || await prisma.user.findFirst();
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'No user available for shift' }, { status: 400 });
    }

    // Check if cashier already has an active shift
    const existingActive = await prisma.cashierShift.findFirst({
      where: { cashierId: targetUser.id, status: 'ACTIVE' },
    });

    if (existingActive) {
      return NextResponse.json(existingActive, { status: 200 });
    }

    const shift = await prisma.cashierShift.create({
      data: {
        cashierId: targetUser.id,
        cashierName: targetUser.name,
        beginningCash: Number(beginningCash) || 0,
        shiftType: (shiftType as Shift) || 'MORNING',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error('Error starting cashier shift:', error);
    return NextResponse.json(
      { error: 'Failed to start cashier shift' },
      { status: 500 }
    );
  }
}
