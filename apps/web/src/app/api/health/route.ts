import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'summit-web',
    timestamp: new Date().toISOString(),
  });
}
