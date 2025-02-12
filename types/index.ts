export interface Anime {
  mal_id: number
  title: string
  synopsis: string;
  images: {
    jpg: {
      image_url?: string
      large_image_url?: string
    }
  }
  genres?: {
    name: string;
  }[];
  score: number
  episodes: number
  status: string
}

export interface AnimeListProps {
  animes: Anime[]
  onAnimeSelect: (anime: Anime) => void
}

export interface SearchResult {
  mal_id: number
  title: string
  type: string
  year: number
  images: {
    jpg: {
      small_image_url: string
    }
  }
}

