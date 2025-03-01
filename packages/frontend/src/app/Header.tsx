import Link from 'next/link'

export const Header = () => {
  return (
    <header className="sticky top-0 w-full px-24 h-16 border-b border-gray-200 flex items-center bg-white">
      <nav className="flex items-center gap-4 w-full">
        <Link href="/">Dashboard</Link>
        <Link href="/projects">Projects</Link>
      </nav>
    </header>
  )
}
