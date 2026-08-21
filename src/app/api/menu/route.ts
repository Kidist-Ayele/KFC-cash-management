import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

// GET /api/menu - Get all menu items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const menuItems = await prisma.menuItem.findMany({
      where: showAll ? {} : { isAvailable: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/menu - Create a new menu item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, category, description, imageUrl, isAvailable } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        price: Number(price),
        category: category as Category,
        description: description || null,
        imageUrl: imageUrl || null,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
