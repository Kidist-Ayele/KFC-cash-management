import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/branches - List all branches
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

// POST /api/branches - Create a new branch
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, manager, phone, status, staffCount } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Branch name and location are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.branch.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A branch with this name already exists' },
        { status: 409 }
      );
    }

    const branch = await prisma.branch.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        manager: manager ? manager.trim() : null,
        phone: phone ? phone.trim() : null,
        status: status || 'ACTIVE',
        staffCount: staffCount ? parseInt(staffCount, 10) : 0,
      },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
  }
}
