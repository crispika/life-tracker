import '@/app/globals.css'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Inter } from 'next/font/google'
import { AppSidebar } from './components/AppSidebar'
import { QueryProvider } from './components/QueryProvider'
import { Toaster } from '@/components/ui/toaster'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Life Tracker',
  description: 'The means must meet the end!'
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
