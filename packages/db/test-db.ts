import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const test = await prisma.test.create({
      data: {
        name: '测试数据'
      }
    });
    console.log('创建的测试数据:', test);

    const allTests = await prisma.test.findMany();
    console.log('所有测试数据:', allTests);
  } catch (error) {
    console.error('错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 