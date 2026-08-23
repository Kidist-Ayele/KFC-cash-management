import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Shift, OrderStatus, PaymentChannel } from '@prisma/client';

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, subtotal, vat, total, amountPaid, paymentChannel, userId, waiter, waiterId } = body;

    // Generate unique order number
    const todayCount = await prisma.order.count();
    const orderNumber = `ORDER #${9400 + todayCount + 1}`;

    // Ensure we have a valid userId
    let assignedUserId = userId;
    if (!assignedUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: 'CASHIER' },
      }) || await prisma.user.findFirst();
      assignedUserId = defaultUser?.id;
    }

    if (!assignedUserId) {
      return NextResponse.json(
        { error: 'No user found in database to assign order' },
        { status: 400 }
      );
    }

    // Resolve waiter ID if waiter name provided
    let resolvedWaiterId = waiterId;
    let waiterName = waiter || 'Desalegn';
    if (!resolvedWaiterId && waiterName) {
      const foundWaiter = await prisma.waiter.findUnique({
        where: { name: waiterName },
      });
      if (foundWaiter) {
        resolvedWaiterId = foundWaiter.id;
      }
    }

    const billTotal = Number(total);
    const receivedAmount = amountPaid !== undefined && amountPaid !== null ? Number(amountPaid) : billTotal;
    const tip = Math.max(0, receivedAmount - billTotal);

    // Create order with items in PostgreSQL
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: Number(subtotal),
        vat: Number(vat),
        total: billTotal,
        amountPaid: receivedAmount,
        tip,
        status: OrderStatus.PAID,
        paymentChannel: paymentChannel as PaymentChannel,
        waiter: waiterName,
        waiterId: resolvedWaiterId || null,
        userId: assignedUserId,
        shift: getCurrentShift() as Shift,
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId || item.menuItem?.id || item.id,
            quantity: Number(item.quantity) || 1,
            price: Number(item.menuItem?.price || item.price),
          })),
        },
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
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get today's orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        ...(userId && { userId }),
        createdAt: {
          gte: today,
        },
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
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit ? { take: parseInt(limit, 10) } : {}),
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

function getCurrentShift(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'MORNING';
  if (hour < 18) return 'AFTERNOON';
  return 'EVENING';
}
