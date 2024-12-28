import { prisma } from '@life-tracker/common';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tests = await prisma.test.findMany();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
} 