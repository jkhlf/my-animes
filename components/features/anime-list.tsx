import Image from "next/image"
import { Star } from "lucide-react"
import { AnimeListProps } from "@/types"


export default function AnimeList({ animes, onAnimeSelect }: AnimeListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {animes.map((anime) => (
        <div
          key={anime.mal_id}
          className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => onAnimeSelect(anime)}
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={anime.images.jpg.image_url || "/placeholder.svg"}
              alt={anime.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold line-clamp-2 mb-2">{anime.title}</h3>
            <div className="flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{anime.score || "N/A"}</span>
              </div>
              <span>{anime.episodes || "?"} eps</span>
            </div>
            <div className="mt-2 text-xs text-white/40">{anime.status}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

