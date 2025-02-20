import { useAnimeStore } from '@/services/store';
import AnimeCard from '@/components/features/anime-card';
import React from 'react';

export function AnimeListsPage() { 
  const { favorites, watched, watchlist } = useAnimeStore(); 

  const renderAnimeList = (list: any[], listName: string, emptyMessage: string) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <h3 className="text-lg font-semibold mb-2">{`Your ${listName} is empty`}</h3>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-xl font-bold mb-4">{listName}</h3> 
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {list.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8"> 
      <h2 className="text-3xl font-bold mb-8 text-center">Your Anime Lists</h2> 

      {renderAnimeList(favorites, 'Favorites', 'Start adding anime you love to your favorites!')}
      {renderAnimeList(watchlist, 'Watchlist', 'Add anime you plan to watch to your watchlist.')}
      {renderAnimeList(watched, 'Watched Anime', 'Keep track of the anime you have already watched.')}
    </div>
  );
}