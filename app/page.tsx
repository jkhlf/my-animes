import SearchBar from "@/components/features/search-bar"
import { getTopAnime, getSeasonalAnime } from "@/services/api/jikan-api"
import Link from "next/link"
import { Info } from "lucide-react"
import Image from "next/image"
import type { Anime } from "@/types"


async function getTrendingAnime(): Promise<Anime[]> {
  const data = await getTopAnime(1);
  return data.data.slice(0, 5);
}

async function getLatestAnime(): Promise<Anime[]> {
  const currentYear = new Date().getFullYear();
  const data = await getSeasonalAnime(currentYear, "winter");
  return data.data.slice(0, 8);
}

export default async function Home() {
  const trendingAnime = await getTrendingAnime();
  const latestAnime = await getLatestAnime();

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
          <div className="relative flex gap-4 overflow-x-auto pb-8 -mx-4 px-4">
            {trendingAnime.map((anime, index) => (
              <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="relative flex-none w-[300px] group">
                <div className="absolute text-[120px] font-bold text-white/10 top-0 left-0 leading-none z-10">
                  {index + 1}
                </div>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                  <Image
                    src={anime.images.jpg.large_image_url || "/placeholder.svg"}
                    alt={anime.title}
                    layout="fill"
                    className="transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{anime.title}</h3>
                    <p className="text-sm text-white/80 line-clamp-2">{anime.synopsis}</p>
                  </div>
                </div>
              </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestAnime.map((anime) => (
              <Link
                href={`/anime/${anime.mal_id}`}
                key={anime.mal_id}
                className="group relative bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-500"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={anime.images.jpg.large_image_url || "/placeholder.svg"}
                    alt={anime.title}
                    layout="fill"
                    className="transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 transform transition-all duration-300 translate-y-8 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{anime.title}</h3>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {anime.genres?.slice(0, 2).map((genre) => (
                        <span
                          key={`${anime.mal_id}-${genre.name}`}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                      <Info className="w-4 h-4" />
                      More Info
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
