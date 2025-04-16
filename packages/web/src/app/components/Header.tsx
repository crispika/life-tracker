'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 w-full px-24 h-16 border-b border-gray-200 flex items-center bg-white">
      <nav className="flex items-center gap-6 w-full text-lg">
        <Link href="/" className={getClassName(pathname, '/')}>
          Dashboard
        </Link>
        <Link href="/tasks" className={getClassName(pathname, '/tasks')}>
          Tasks
        </Link>
      </nav>
    </header>
  );
};

const getClassName = (pathname: string, href: string) => {
  let selected = false;
  switch (href) {
    case '/':
      selected = pathname === href;
      break;
    case '/tasks':
      selected = pathname.includes('/tasks');
      break;
  }
  return selected
    ? 'text-primary font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors duration-200'
    : 'text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200';
};
