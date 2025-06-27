import { NextResponse } from 'next/server';
import { getProjectStats } from '@/lib/data';

export async function GET() {
  try {
    const stats = await getProjectStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}