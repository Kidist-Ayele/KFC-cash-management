import { NextResponse } from 'next/server';

// POST /api/reports/send-telegram
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, botToken, chatId } = body;

    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chat = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat) {
      return NextResponse.json(
        {
          error:
            'Telegram bot token or chat ID is missing. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to your .env file or enter them in the form.',
        },
        { status: 400 }
      );
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      return NextResponse.json(
        { error: data.description || 'Telegram API rejected message' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, result: data.result });
  } catch (error) {
    console.error('Error sending telegram report:', error);
    return NextResponse.json(
      { error: 'Failed to send report via Telegram' },
      { status: 500 }
    );
  }
}
