import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ExpenseCategory } from '@prisma/client';

// GET /api/expenses - List all expenses
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, category, addedBy, userId } = body;

    if (!description || !amount) {
      return NextResponse.json(
        { error: 'Description and amount are required' },
        { status: 400 }
      );
    }

    // Convert category string (e.g. 'Supplies') to uppercase enum ('SUPPLIES')
    const categoryEnum = (category?.toUpperCase() || 'OTHER') as ExpenseCategory;

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: Number(amount),
        category: categoryEnum,
        addedBy: addedBy || 'Cashier',
        ...(userId ? { userId } : {}),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
