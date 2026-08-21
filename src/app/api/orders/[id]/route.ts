import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentChannel } from '@prisma/client';

// PATCH /api/orders/[id] - Update an order
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentChannel, waiter } = body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status: status as OrderStatus }),
        ...(paymentChannel && { paymentChannel: paymentChannel as PaymentChannel }),
        ...(waiter && { waiter }),
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
