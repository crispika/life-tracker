import { prisma } from '@life-tracker/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tests = await prisma.test.findMany();
    console.log('API路由: 获取到的测试数据', tests);
    return NextResponse.json(tests);
  } catch (error) {
    console.error('API路由: 错误', error);
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    );
  }
} 