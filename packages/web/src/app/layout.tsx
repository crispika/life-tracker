import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { Header } from './components/Header';
import { QueryProvider } from './components/QueryProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Life Tracker',
  description: 'The means must meet the end!',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  }
};
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
