
import React from "react";
import { getSeasonalAnime } from "@/services/api/jikan-api";
import AnimeCard from "@/components/features/anime-card";
import type { Anime } from "@/types";

async function getCurrentSeasonAnime(): Promise<Anime[]> {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  let season = "winter";
  
  if (month >= 4 && month <= 6) season = "spring";
  else if (month >= 7 && month <= 9) season = "summer";
  else if (month >= 10) season = "fall";

  const response = await getSeasonalAnime(year, season);
  return response.data.data;
}

export default async function SeasonalAnimePage() {
  const seasonalAnime = await getCurrentSeasonAnime();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Current Season Anime</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {seasonalAnime.map((anime) => (
          <AnimeCard 
            key={`${anime.mal_id}-${anime.title}`} 
            anime={anime} 
          />
        ))}
      </div>
    </div>
  );
}
