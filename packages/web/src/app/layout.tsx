import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Header } from './Header'
import { QueryProvider } from './QueryProvider'

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
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
