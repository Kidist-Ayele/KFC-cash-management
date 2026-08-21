import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
