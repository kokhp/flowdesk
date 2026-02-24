import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Placeholder for cron jobs (email reminders, cleanup, etc.)
  // Codex will add product-specific cron logic here

  return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
}
