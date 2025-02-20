import SearchBar from "@/components/features/search-bar"
import { getTopAnime, getSeasonalAnime, getTopManga } from "@/services/api/jikan-api"
import Link from "next/link"
import type { Anime, Manga } from "@/types"
import AnimeCard from "@/components/features/anime-card"
import MangaCard from "@/components/features/manga-card"

async function getTrendingAnime(): Promise<Anime[]> {
  const response = await getTopAnime(1);
  return response.data.data.slice(0, 5);
}

async function getLatestAnime(): Promise<Anime[]> {
  const currentYear = new Date().getFullYear();
  const response = await getSeasonalAnime(currentYear, "winter");
  return response.data.data.slice(0, 8);
}

async function getNewReleases(): Promise<Manga[]> {
  const response = await getTopManga(1);
  return response.data.data.slice(0, 5);
}

export default async function Home() {
  const [trendingAnime, latestAnime, newReleases] = await Promise.all([
    getTrendingAnime(),
    getLatestAnime(),
    getNewReleases()
  ]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tracking anime</h1>
          <p className="text-gray-800/70 text-lg mb-8 max-w-2xl mx-auto">
            Find information about your favorite anime and manga, and discover new ones.
          </p>
          <SearchBar />
        </section>

        {/* Trending Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending Anime</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {trendingAnime.map((anime) => (
              
              <AnimeCard key={anime.mal_id} anime={anime} />
              
            ))}
          </div>
        </section>

        {/* Latest Releases Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Releases</h2>
            <Link href="/seasonal-anime" className="text-gray-800/80 hover:text-gray-900 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {latestAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>

           {/* New Releases Section */}
           <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">新刊</h2>
            <div className="text-sm text-gray-500">NEW BOOKS</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {newReleases.map((manga) => (
              <MangaCard
                key={manga.mal_id}
                id={manga.mal_id.toString()}
                title={manga.title}
                imageUrl={manga.images.jpg.image_url}
                releaseDate={manga.published.from}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
