import { DocSidebar } from './components/doc-side-bar';

export default function DocumentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] mx-auto max-w-[105rem] ">
      <div className="flex items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <DocSidebar />
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          {children}
        </main>
      </div>
    </div>
  );
}
