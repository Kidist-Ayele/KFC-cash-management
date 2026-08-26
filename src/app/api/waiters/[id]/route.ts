import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/waiters/[id] - Update waiter details or active status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, isActive } = body;

    const updated = await prisma.waiter.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating waiter:', error);
    return NextResponse.json(
      { error: 'Failed to update waiter' },
      { status: 500 }
    );
  }
}

// DELETE /api/waiters/[id] - Delete or soft-delete waiter
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if waiter has orders
    const ordersCount = await prisma.order.count({
      where: { waiterId: id },
    });

    if (ordersCount > 0) {
      // Soft-delete if has orders to preserve financial audit history
      const deactivated = await prisma.waiter.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true, waiter: deactivated });
    }

    // Hard-delete if no associated orders
    await prisma.waiter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting waiter:', error);
    return NextResponse.json(
      { error: 'Failed to delete waiter' },
      { status: 500 }
    );
  }
}
