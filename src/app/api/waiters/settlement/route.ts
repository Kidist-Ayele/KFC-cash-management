import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/waiters/settlement - Calculate daily breakdown per waiter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    const startOfDay = dateParam ? new Date(dateParam) : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const [waiters, orders, pettyCashRecords] = await Promise.all([
      prisma.waiter.findMany({ where: { isActive: true } }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
          status: 'PAID',
        },
      }),
      prisma.waiterPettyCash.findMany({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      }),
    ]);

    const settlements = waiters.map((waiter) => {
      // Match orders by waiterId or by waiter name fallback
      const waiterOrders = orders.filter(
        (o) => o.waiterId === waiter.id || o.waiter?.toLowerCase() === waiter.name.toLowerCase()
      );

      const waiterPettyCash = pettyCashRecords.filter((p) => p.waiterId === waiter.id);
      const totalPettyCash = waiterPettyCash.reduce((sum, p) => sum + p.amount, 0);

      const totalCashOrders = waiterOrders
        .filter((o) => o.paymentChannel === 'CASH')
        .reduce((sum, o) => sum + o.total, 0);

      const totalTransferOrders = waiterOrders
        .filter((o) => o.paymentChannel !== 'CASH')
        .reduce((sum, o) => sum + o.total, 0);

      const totalTips = waiterOrders.reduce((sum, o) => sum + (o.tip || 0), 0);
      const totalSales = totalCashOrders + totalTransferOrders;

      return {
        waiterId: waiter.id,
        waiterName: waiter.name,
        ordersCount: waiterOrders.length,
        totalSales,
        totalCashOrders,
        totalTransferOrders,
        totalPettyCash,
        totalTips,
        // Net cash waiter owes cashier = Petty cash given + Cash collected - Tips
        cashBalanceDue: totalPettyCash + totalCashOrders - totalTips,
      };
    });

    return NextResponse.json(settlements);
  } catch (error) {
    console.error('Error generating waiter settlements:', error);
    return NextResponse.json(
      { error: 'Failed to calculate waiter settlements' },
      { status: 500 }
    );
  }
}
