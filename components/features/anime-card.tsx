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
      className="group relative bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-500"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url || "/placeholder.svg"}
          alt={anime.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badge de classificação */}
        <div className="absolute top-2 left-2 z-10">
          {getRatingBadge(anime.rating)}
        </div>

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Informações ocultas até o hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 space-y-2 transform transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          {/* Linha 1: Título e episódios */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-white line-clamp-2">
              {anime.title}
            </h3>
            {anime.episodes && (
              <p className="text-xs text-gray-300">
                {anime.episodes} ep{anime.episodes > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Linha 2: Score, membros e ranking */}
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

          {/* Linha 3: Gêneros */}
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

          {/* Linha 4: Botão More Info */}
          <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm">
            <Info className="w-4 h-4" />
            More Info
          </button>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
