import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/cashier-shifts/[id]/close - Close shift and reconcile cash
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { closingCash, notes } = body;

    const shift = await prisma.cashierShift.findUnique({
      where: { id },
    });

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    if (shift.status === 'CLOSED') {
      return NextResponse.json({ error: 'Shift is already closed' }, { status: 400 });
    }

    const shiftStart = shift.startedAt;
    const shiftEnd = new Date();

    // Query all orders placed during this shift by this cashier
    const orders = await prisma.order.findMany({
      where: {
        userId: shift.cashierId,
        createdAt: { gte: shiftStart, lte: shiftEnd },
        status: 'PAID',
      },
    });

    // Query expenses registered during this shift
    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: { gte: shiftStart, lte: shiftEnd },
      },
    });

    const totalCashSales = orders
      .filter((o) => o.paymentChannel === 'CASH')
      .reduce((sum, o) => sum + o.total, 0);

    const totalTransfer = orders
      .filter((o) => o.paymentChannel !== 'CASH')
      .reduce((sum, o) => sum + o.total, 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalTipsGiven = orders.reduce((sum, o) => sum + (o.tip || 0), 0);

    // Business Math:
    // Expected Cash Drawer = Beginning Cash + Cash Sales - Total Expenses - Tips Given
    const expectedCash = shift.beginningCash + totalCashSales - totalExpenses - totalTipsGiven;
    const countedClosingCash = Number(closingCash) || 0;
    const cashDifference = countedClosingCash - expectedCash;

    const closedShift = await prisma.cashierShift.update({
      where: { id },
      data: {
        closingCash: countedClosingCash,
        expectedCash,
        cashDifference,
        totalCashSales,
        totalTransfer,
        totalExpenses,
        totalTipsGiven,
        notes: notes || null,
        status: 'CLOSED',
        closedAt: shiftEnd,
      },
    });

    return NextResponse.json(closedShift);
  } catch (error) {
    console.error('Error closing cashier shift:', error);
    return NextResponse.json(
      { error: 'Failed to close cashier shift' },
      { status: 500 }
    );
  }
}
