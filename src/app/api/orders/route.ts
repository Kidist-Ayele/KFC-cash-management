import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Shift, OrderStatus, PaymentChannel } from '@prisma/client';

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, subtotal, vat, total, paymentChannel, userId, waiter } = body;

    // Generate unique order number (e.g., ORDER#1024 or based on count/timestamp)
    const todayCount = await prisma.order.count();
    const orderNumber = `ORDER #${9400 + todayCount + 1}`;

    // Ensure we have a valid userId (fallback to first cashier or any user in DB)
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

    // Create order with items in PostgreSQL
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: Number(subtotal),
        vat: Number(vat),
        total: Number(total),
        status: OrderStatus.PAID,
        paymentChannel: paymentChannel as PaymentChannel,
        waiter: waiter || 'Desalegn',
        userId: assignedUserId,
        shift: getCurrentShift() as Shift,
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItem?.id || item.id,
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
