import SearchBar from "@/components/features/search-bar"
import { getTopAnime, getSeasonalAnime } from "@/services/api/jikan-api"
import Link from "next/link"
import { Info } from "lucide-react"
import Image from "next/image"
import type { Anime } from "@/types"
import AnimeCard from "@/components/features/anime-card"


async function getTrendingAnime(): Promise<Anime[]> {
  const response = await getTopAnime(1);
  // Access the data property from the new API response format
  return response.data.data.slice(0, 5);
}

async function getLatestAnime(): Promise<Anime[]> {
  const currentYear = new Date().getFullYear();
  const response = await getSeasonalAnime(currentYear, "winter");
  // Access the data property from the new API response format
  return response.data.data.slice(0, 8);
}

export default async function Home() {
  const [trendingAnime, latestAnime] = await Promise.all([
    getTrendingAnime(),
    getLatestAnime()
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section with Search */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Discover Your Next Favorite Anime</h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Track, discover, and explore thousands of anime series and movies
          </p>
          <SearchBar />
        </section>

        {/* Trending Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Trending Anime</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>

        {/* Latest Releases Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Releases</h2>
            <Link href="/seasonal-anime" className="text-white/80 hover:text-white transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {latestAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
