import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, Star } from "lucide-react";
import type { Anime } from "@/types";

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const displayedGenres = anime.genres?.slice(0, 2) || [];
  const genreCountOverflow = (anime.genres?.length || 0) - displayedGenres.length;

  // Badge que mostra a classificação indicativa (rating)
  const getRatingBadge = (rating?: string | null) => {
    const ratingText = rating || "PG-13";
    let bgColor = "bg-black/60";
    if (ratingText === "R") {
      bgColor = "bg-red-600/80";
    }
    return (
      <div className={`text-xs text-white px-2 py-0.5 rounded ${bgColor}`}>
        {ratingText}
      </div>
    );
  };

  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-lg
        bg-white/5
        hover:bg-white/10
        transition-all
        duration-500
      "
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url || "/placeholder.svg"}
          alt={anime.title}
          fill
          className="
            object-cover
            transform
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />
        
        <div className="absolute top-2 left-2 z-10">
          {getRatingBadge(anime.rating)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-gradient-to-t from-black via-black/40 to-transparent">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-white line-clamp-2 pr-2">
        {anime.title}
          </h3>
          {anime.episodes && (
        <p className="text-xs text-gray-300">
          {anime.episodes} ep
          {anime.episodes > 1 ? "s" : ""}
        </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {anime.score && (
              <div className="flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{anime.score}</span>
              </div>
            )}
            {anime.members && (
              <span className="whitespace-nowrap">
                {anime.members.toLocaleString()} users
              </span>
            )}
          </div>

          {anime.rank && (
            <div className="whitespace-nowrap">
              #<span className="text-white font-medium">{anime.rank}</span>{" "}
              <span className="text-gray-500">Ranking</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {displayedGenres.map((genre) => (
            <span
              key={`${anime.mal_id}-${genre.name}`}
              className="bg-[#25262b] text-gray-300 text-xs px-2 py-0.5 rounded-sm"
            >
              {genre.name}
            </span>
          ))}
          {genreCountOverflow > 0 && (
            <span className="bg-[#25262b] text-gray-300 text-xs px-2 py-0.5 rounded-sm">
              +{genreCountOverflow}
            </span>
          )}
        </div>

        <button
          className="
            w-full
            mt-2
            bg-white/10
            hover:bg-white/20
            text-white
            py-2
            px-4
            rounded-lg
            flex
            items-center
            justify-center
            gap-2
            backdrop-blur-sm
            transition-colors
            duration-300
          "
        >
          <Info className="w-4 h-4" />
          More Info
        </button>
      </div>
    </Link>
  );
};

export default AnimeCard;
