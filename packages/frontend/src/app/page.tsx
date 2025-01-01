import { prisma } from '@life-tracker/db';
type Test = {
  id: number;
  name: string;
  createdAt: Date;
};

export default async function Home() {
  // FIXME why can't I use the api route?
  try {
    console.log('开始获取数据...');
    const tests = await prisma.test.findMany();
    console.log('获取到的数据:', tests);

    return (
      <main className="min-h-screen p-24">
        <h1 className="text-4xl font-bold mb-4">测试数据</h1>
        <div className="grid gap-4">
          {tests.map((test: Test) => (
            <div key={test.id} className="p-4 border rounded shadow">
              <h2 className="text-xl">{test.name}</h2>
              <p className="text-gray-500">
                创建时间: {new Date(test.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    );
  } catch (error: unknown) {
    console.error('错误:', error);
    if (error instanceof Error) {
      return (
        <>
          <div>
            Error loading data{' '}
            {JSON.stringify(
              { error: error.message, stack: error.stack },
              null,
              2
            )}{' '}
          </div>
          <div>{process.env.DATABASE_URL}</div>
        </>
      );
    }
    return <div>发生未知错误</div>;
  }
}
