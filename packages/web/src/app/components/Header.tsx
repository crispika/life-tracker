'use client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import lifetacker from '/public/img/life_tracker.png';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[105rem] mx-auto hidden md:flex h-16 items-center gap-2">
        <Image src={lifetacker} alt="logo" width={85} className="m-2" />
        <nav className="flex items-center w-full text-lg">
          <Link href="/" className={getClassName(pathname, '/')}>
            Dashboard
          </Link>
          <Link href="/goals" className={getClassName(pathname, '/goals')}>
            Goals
          </Link>
          <Link href="/tasks" className={getClassName(pathname, '/tasks')}>
            Tasks
          </Link>
          <Link href="#" className={getClassName(pathname, '/docs')}>
            Documents
          </Link>
        </nav>
      </div>
      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetTitle>
              <Image src={lifetacker} alt="logo" width={60} className="-mt-3" />
            </SheetTitle>
            <nav className="flex items-center flex-col gap-2 w-full text-lg">
              <Link href="/" className={getClassName(pathname, '/')}>
                Dashboard
              </Link>
              <Link href="/goals" className={getClassName(pathname, '/goals')}>
                Goals
              </Link>
              <Link href="/tasks" className={getClassName(pathname, '/tasks')}>
                Tasks
              </Link>
              <Link href="#" className={getClassName(pathname, '/docs')}>
                Documents
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
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
    case '/goals':
      selected = pathname.includes('/goals');
      break;
    case '/docs':
      selected = pathname.includes('/docs');
      break;
  }
  return selected
    ? 'text-primary font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors duration-200'
    : 'text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200';
};
