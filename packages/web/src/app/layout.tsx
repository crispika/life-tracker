import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { QueryProvider } from './components/QueryProvider'
import { AppSidebar } from './components/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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
      </body>
    </html>
  )
}
