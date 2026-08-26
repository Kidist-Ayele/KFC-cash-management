import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentChannel, OrderStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';

    const now = new Date();
    let startDate: Date | undefined;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else if (period === 'week') {
      const dayOfWeek = now.getDay();
      const diffToMonday = (dayOfWeek + 6) % 7;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    }
    // 'all' means no startDate filter

    const dateFilter = startDate ? { gte: startDate } : undefined;

    // 1. Fetch Orders
    const orders = await prisma.order.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
        status: OrderStatus.PAID,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch Expenses
    const expenses = await prisma.expense.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Fetch Recent Cashier Shifts
    const recentShifts = await prisma.cashierShift.findMany({
      where: {
        ...(dateFilter && { startedAt: dateFilter }),
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
    });

    // 4. Staff counts
    const totalUsers = await prisma.user.count({ where: { isActive: true } });
    const totalWaiters = await prisma.waiter.count({ where: { isActive: true } });

    // --- CALCULATIONS ---
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalTips = orders.reduce((sum, o) => sum + (o.tip || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Channel Breakdown
    const channelMap: Record<string, { amount: number; count: number }> = {
      [PaymentChannel.TELEBIRR]: { amount: 0, count: 0 },
      [PaymentChannel.KUKU_CBE]: { amount: 0, count: 0 },
      [PaymentChannel.SAMUEL_CBE]: { amount: 0, count: 0 },
      [PaymentChannel.CASH]: { amount: 0, count: 0 },
    };

    orders.forEach((o) => {
      const ch = o.paymentChannel || PaymentChannel.CASH;
      if (!channelMap[ch]) {
        channelMap[ch] = { amount: 0, count: 0 };
      }
      channelMap[ch].amount += o.total || 0;
      channelMap[ch].count += 1;
    });

    const channels = Object.entries(channelMap).map(([channel, data]) => ({
      channel,
      amount: data.amount,
      count: data.count,
      percentage: totalRevenue > 0 ? (data.amount / totalRevenue) * 100 : 0,
    }));

    // Food Item & Category Analytics
    const dishMap: Record<string, { name: string; category: string; quantity: number; revenue: number }> = {};
    const categoryMap: Record<string, { category: string; quantity: number; revenue: number }> = {};

    orders.forEach((o) => {
      o.orderItems.forEach((item) => {
        const dishName = item.menuItem?.name || 'Unknown Item';
        const category = item.menuItem?.category || 'EXTRAS';
        const qty = item.quantity || 1;
        const rev = (item.price || 0) * qty;

        // Dish Map
        if (!dishMap[dishName]) {
          dishMap[dishName] = { name: dishName, category, quantity: 0, revenue: 0 };
        }
        dishMap[dishName].quantity += qty;
        dishMap[dishName].revenue += rev;

        // Category Map
        if (!categoryMap[category]) {
          categoryMap[category] = { category, quantity: 0, revenue: 0 };
        }
        categoryMap[category].quantity += qty;
        categoryMap[category].revenue += rev;
      });
    });

    const topDishes = Object.values(dishMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);

    const categoryBreakdown = Object.values(categoryMap)
      .sort((a, b) => b.revenue - a.revenue)
      .map((c) => ({
        ...c,
        percentage: totalRevenue > 0 ? (c.revenue / totalRevenue) * 100 : 0,
      }));

    // Recent 8 Orders
    const recentOrders = orders.slice(0, 8).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      cashier: o.user?.name || 'Cashier',
      waiter: o.waiter || 'Desalegn',
      total: o.total,
      paymentChannel: o.paymentChannel,
      itemsCount: o.orderItems.reduce((acc, it) => acc + (it.quantity || 1), 0),
      createdAt: o.createdAt,
    }));

    return NextResponse.json({
      period,
      summary: {
        totalRevenue,
        totalOrders,
        totalExpenses,
        netProfit,
        totalTips,
        activeStaff: totalUsers + totalWaiters,
        totalUsers,
        totalWaiters,
      },
      channels,
      categoryBreakdown,
      topDishes,
      recentShifts,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executive dashboard metrics' },
      { status: 500 }
    );
  }
}
