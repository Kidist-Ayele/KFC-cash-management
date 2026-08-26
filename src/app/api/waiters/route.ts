import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/waiters - List waiters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';

    let waiters = await prisma.waiter.findMany({
      where: includeAll ? undefined : { isActive: true },
      orderBy: { name: 'asc' },
    });

    // If no waiters exist yet, seed initial default waiters
    if (waiters.length === 0) {
      await prisma.waiter.createMany({
        data: [
          { name: 'Desalegn' },
          { name: 'Marta' },
          { name: 'Serkalem' },
        ],
      });
      waiters = await prisma.waiter.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json(waiters);
  } catch (error) {
    console.error('Error fetching waiters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waiters', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/waiters - Add a new waiter
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Waiter name is required' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Check if waiter already exists
    const existing = await prisma.waiter.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      if (!existing.isActive) {
        // Reactivate waiter
        const reactivated = await prisma.waiter.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
        return NextResponse.json(reactivated, { status: 200 });
      }
      return NextResponse.json(
        { error: 'A waiter with this name already exists' },
        { status: 409 }
      );
    }

    const waiter = await prisma.waiter.create({
      data: {
        name: trimmedName,
        phone: phone ? phone.trim() : null,
        isActive: true,
      },
    });

    return NextResponse.json(waiter, { status: 201 });
  } catch (error) {
    console.error('Error creating waiter:', error);
    return NextResponse.json(
      { error: 'Failed to create waiter' },
      { status: 500 }
    );
  }
}
