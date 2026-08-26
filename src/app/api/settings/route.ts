import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/settings - Fetch current system settings
export async function GET() {
  try {
    let settings = await prisma.systemSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: {
          id: 'default',
          companyName: 'Kuku Fried Chicken (KFC)',
          branchName: 'Main Branch — Ayat, Addis Ababa',
          ownerName: 'Samuel Mulat',
          managerName: 'Lishan Bekele',
          vatRate: 15,
          currency: 'ETB',
          timezone: 'Africa/Addis_Ababa',
          telegramBot: '@kuku_kfc_report_bot',
          telegramChatId: '1794854523',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST /api/settings - Update and persist system settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      branchName,
      ownerName,
      managerName,
      vatRate,
      currency,
      timezone,
      telegramBot,
      telegramChatId,
      telebirrActive,
      kukuCbeActive,
      samuelCbeActive,
      cashActive,
    } = body;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...(companyName !== undefined && { companyName }),
        ...(branchName !== undefined && { branchName }),
        ...(ownerName !== undefined && { ownerName }),
        ...(managerName !== undefined && { managerName }),
        ...(vatRate !== undefined && { vatRate: parseFloat(vatRate) || 15 }),
        ...(currency !== undefined && { currency }),
        ...(timezone !== undefined && { timezone }),
        ...(telegramBot !== undefined && { telegramBot }),
        ...(telegramChatId !== undefined && { telegramChatId }),
        ...(telebirrActive !== undefined && { telebirrActive: Boolean(telebirrActive) }),
        ...(kukuCbeActive !== undefined && { kukuCbeActive: Boolean(kukuCbeActive) }),
        ...(samuelCbeActive !== undefined && { samuelCbeActive: Boolean(samuelCbeActive) }),
        ...(cashActive !== undefined && { cashActive: Boolean(cashActive) }),
      },
      create: {
        id: 'default',
        companyName: companyName || 'Kuku Fried Chicken (KFC)',
        branchName: branchName || 'Main Branch — Ayat, Addis Ababa',
        ownerName: ownerName || 'Samuel Mulat',
        managerName: managerName || 'Lishan Bekele',
        vatRate: parseFloat(vatRate) || 15,
        currency: currency || 'ETB',
        timezone: timezone || 'Africa/Addis_Ababa',
        telegramBot: telegramBot || '@kuku_kfc_report_bot',
        telegramChatId: telegramChatId || '1794854523',
        telebirrActive: telebirrActive !== undefined ? Boolean(telebirrActive) : true,
        kukuCbeActive: kukuCbeActive !== undefined ? Boolean(kukuCbeActive) : true,
        samuelCbeActive: samuelCbeActive !== undefined ? Boolean(samuelCbeActive) : true,
        cashActive: cashActive !== undefined ? Boolean(cashActive) : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
