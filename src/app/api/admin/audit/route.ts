import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Shifts
    const shifts = await prisma.cashierShift.findMany({
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    // 2. Orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: {
        user: { select: { name: true } },
      },
    });

    // 3. Expenses
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 4. Users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const auditEvents: any[] = [];

    // Map shifts
    shifts.forEach((s) => {
      if (s.closedAt) {
        auditEvents.push({
          id: `shift-close-${s.id}`,
          timestamp: s.closedAt,
          user: s.cashierName,
          role: 'CASHIER',
          action: 'Shift Closed & Reconciled',
          details: `Shift closed. Counted: ETB ${s.closingCash ?? 0}, Expected: ETB ${s.expectedCash ?? 0}, Difference: ${
            s.cashDifference !== null ? (s.cashDifference >= 0 ? `+ETB ${s.cashDifference}` : `-ETB ${Math.abs(s.cashDifference)}`) : 'N/A'
          }`,
          type: s.cashDifference && s.cashDifference < 0 ? 'ALERT' : 'SHIFT',
        });
      }
      auditEvents.push({
        id: `shift-open-${s.id}`,
        timestamp: s.startedAt,
        user: s.cashierName,
        role: 'CASHIER',
        action: 'Shift Drawer Opened',
        details: `Started ${s.shiftType} shift with initial float of ETB ${s.beginningCash}`,
        type: 'SHIFT',
      });
    });

    // Map orders
    orders.forEach((o) => {
      auditEvents.push({
        id: `order-${o.id}`,
        timestamp: o.createdAt,
        user: o.user?.name || 'Cashier',
        role: 'CASHIER',
        action: 'Processed Order',
        details: `${o.orderNumber} - ETB ${o.total.toFixed(2)} via ${o.paymentChannel} (Waiter: ${o.waiter || 'Desalegn'})`,
        type: 'ORDER',
      });
    });

    // Map expenses
    expenses.forEach((e) => {
      auditEvents.push({
        id: `expense-${e.id}`,
        timestamp: e.createdAt,
        user: e.addedBy,
        role: 'CASHIER / MANAGER',
        action: 'Logged Petty Cash Expense',
        details: `ETB ${e.amount.toFixed(2)} for "${e.description}" (${e.category})`,
        type: 'EXPENSE',
      });
    });

    // Map users
    users.forEach((u) => {
      auditEvents.push({
        id: `user-${u.id}`,
        timestamp: u.createdAt,
        user: 'Samuel Mulat',
        role: 'SUPER_ADMIN',
        action: 'Account Created',
        details: `Created ${u.role} account for "${u.name}" (${u.email})`,
        type: 'USER',
      });
    });

    // Sort all events by timestamp descending
    auditEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(auditEvents);
  } catch (error) {
    console.error('Error generating audit log:', error);
    return NextResponse.json({ error: 'Failed to generate audit log' }, { status: 500 });
  }
}
