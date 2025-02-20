import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-[#0a0a0f] border-b border-white/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Anime<span className="text-blue-500">Tracker</span>
          </Link>
          <div className="space-x-6">
            <Link href="/top-anime" className="text-white/80 hover:text-white transition-colors">
              Top Anime
            </Link>
            <Link href="/seasonal-anime" className="text-white/80 hover:text-white transition-colors">
              Seasonal
            </Link>
            <Link href="/tracker" className="text-white/80 hover:text-white transition-colors">
              Your List
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

