import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Header } from './Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Life Tracker',
  description: 'Track your life'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
