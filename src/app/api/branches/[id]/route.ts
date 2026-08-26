import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/branches/[id] - Update branch details or status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location, manager, phone, status, staffCount } = body;

    const updated = await prisma.branch.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(location && { location: location.trim() }),
        ...(manager !== undefined && { manager: manager ? manager.trim() : null }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
        ...(status && { status }),
        ...(staffCount !== undefined && { staffCount: parseInt(staffCount, 10) || 0 }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 });
  }
}

// DELETE /api/branches/[id] - Delete branch
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.branch.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: 'Failed to delete branch' }, { status: 500 });
  }
}
