import React from 'react';
import Image from "next/image";
import Link from "next/link";
import type { Anime } from "@/types"
import { Star } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const displayedGenres = anime.genres?.slice(0, 2) || [];
  const genreCountOverflow = (anime.genres?.length || 0) - displayedGenres.length;

  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="group relative w-[240px] bg-[#181818] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300" // Wider card, darker background
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-md"> {/* Rounded top for image */}
        <Image
          src={anime.images.jpg.large_image_url || "/placeholder.svg"}
          alt={anime.title}
          width={240}
          height={360}
          className="object-cover rounded-t-md" // Match rounded top to container
        />
      </div>

      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-white line-clamp-2">
              {anime.title}
            </h3>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="bg-[#373747] text-white text-xs rounded px-2 py-0.5 font-medium"> {/* Less rounded badge */}
              {anime.status === "Finished Airing" ? "Finished Airing" : `${anime.episodes || "?"} episodes`} {/* "episodes" text */}
            </div>
            {anime.episodes && anime.status !== "Finished Airing" && (
              <div className="text-gray-400 text-xs">
                {anime.episodes} episodes
              </div>
            )}
          </div>
        </div>


        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-500 w-3.5 h-3.5 fill-yellow-500" /> {/* Smaller star */}
              <span className="text-white font-medium">{anime.score || "N/A"}</span> {/* Score more prominent */}
            </div>
            <span className="text-gray-500">•</span> {/* Separator dot */}
            <span>{anime.popularity?.toLocaleString() || "N/A"} users</span> {/* User count instead of rank/popularity */}
          </div>
          {anime.rank && (
              <div className="text-gray-400">
                 Ranking <span className="text-white font-medium">#{anime.rank}</span>
              </div>
          )}
        </div>


        <div className="flex flex-wrap gap-2 mt-1"> {/* Genre tags container */}
          {displayedGenres.map((genre) => (
            <span
              key={`${anime.mal_id}-${genre.name}`}
              className="bg-[#2d2d3a] text-gray-300 text-xs rounded px-2 py-0.5" // Button-like genre tags
            >
              {genre.name}
            </span>
          ))}
          {genreCountOverflow > 0 && (
            <span className="bg-[#2d2d3a] text-gray-300 text-xs rounded px-2 py-0.5">
              +{genreCountOverflow}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;