export interface Anime {
  mal_id: number,
  url?: string,
  images: {
    jpg?: {
      image_url: string,
      small_image_url: string,
      large_image_url: string
    },
    webp: {
      image_url: string,
      small_image_url?: string,
      large_image_url?: string
    }
  },
  trailer?: {
    youtube_id: string,
    url: string,
    embed_url: string
  },
  approved?: true,
  titles?: [
    {
      type: string,
      title: string
    }
  ],
  title: string,
  title_english?: string,
  title_japanese?: string,
  title_synonyms?: [
    string
  ],
  type?: string,
  source?: string,
  episodes?: number,
  status?: string,
  airing?: true,
  aired?: {
    from: string,
    to: string,
    prop: {
      from: {
        day: number,
        month: number,
        year: number
      },
      to: {
        day: number,
        month: number,
        year: number
      },
      string: string
    }
  },
  duration?: string,
  rating?: string,
  score: number,
  scored_by?: number,
  rank?: number,
  popularity?: number,
  members?: number,
  favorites?: number,
  synopsis?: string,
  background?: string,
  season?: string,
  year: number,
  broadcast?: {
    day: string,
    time: string,
    timezone: string,
    string: string
  },
  producers?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  licensors?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  studios?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  genres?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  explicit_genres?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  themes?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  demographics?: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  relations?: [
    {
      relation: string,
      entry: [
        {
          mal_id: number,
          type: string,
          name: string,
          url: string
        }
      ]
    }
  ],
  theme?: {
    openings: [
      string
    ],
    endings: [
      string
    ]
  },
  external?: [
    {
      name: string,
      url: string
    }
  ],
  streaming?: [
    {
      name: string,
      url: string
    }
  ]
}

export interface AnimeListProps {
  animes: Anime[]
  onAnimeSelect: (anime: Anime) => void
}

export interface AnimeCharacters {
  character: {
    mal_id: number,
    url: string,
    images: {
      jpg: {
        image_url: string,
        small_image_url: string
      },
      webp: {
        image_url: string,
        small_image_url: string
      }
    },
    name: string
  },
  role: string,
  voice_actors: [
    {
      person: {
        mal_id: number,
        url: string,
        images: {
          jpg: {
            image_url: string
          }
        },
        name: string
      },
      language: string
    }
  ]
}

export interface AnimeStaff {
  person: {
    mal_id: number,
    url: string,
    images:
    {
      jpg:

      {
        image_url: string
      }
    },
    name: string

  },
  positions:
  [
    string
  ]
}

export interface AnimeEpisodes {
  mal_id: number;
  url: string
  title: string
  title_japanese: string
  title_romanji: string
  aired: string
  score: null
  filler: true
  recap: true
  forum_url: string
  pagination: {
    last_visible_page: number
    has_next_page: true
  }
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

export interface AnimeNews {
  pagination: {
    last_visible_page: number
    has_next_page: true
  }

  mal_id: number
  url: string
  title: string
  date: string
  author_username: string
  author_url: string
  forum_url: string
  images: {
    jpg: {
      image_url: string
    }
  }
  comments: number
  excerpt: string
}

export interface Manga {
  mal_id: number,
  url: string,
  images:
  {
    jpg:
    {
      image_url: string,
      small_image_url: string,
      large_image_url: string

    },
    webp:
    {

      image_url: string,
      small_image_url: string,
      large_image_url: string

    }
  },
  approved: true,
  titles:
  [
    {
      type: string,
      title: string
    }

  ],
  title: string,
  title_english: string,
  title_japanese: string,
  type: Manga,
  chapters: number,
  volumes: number,
  status: string,
  publishing: true,
  published:
  {
    from: string,
    to: string,
    prop:

    {

      from:
      {

        day: number,
        month: number,
        year: number

      },
      to:

      {
        day: number,
        month: number,
        year: number
      },
      string: string
    }

  },
  score: number,
  scored_by: number,
  rank: number,
  popularity: number,
  members: number,
  favorites: number,
  synopsis: string,
  background: string,
  authors:
  [

    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }

  ],
  serializations:
  [

    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }

  ],
  genres:
  [

    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }

  ],
  explicit_genres:
  [

    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }

  ],
  themes:
  [

    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }

  ],
  demographics:
  [

    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ]
  pagination: {
    last_visible_page: number
    has_next_page: true
    items: {
      count: number
      total: number
      per_page: number
    }
  }
}

export interface MangaCardProps {
  id: string
  title: string
  imageUrl: string
  releaseDate: string
}

export interface CarouselItem {
  id: number
  imageUrl: string
  title: string
  subtitle?: string
  date?: string
}

export interface  AnimePictures {
  images :{
    jpg: {
      image_url: string
    }
  }
}

export interface AnimeStreaming {
  name : string
  url : string 
}