import axios from 'axios';
import axiosRetry from 'axios-retry';

// --- Configurações Gerais ---
const JIKAN_API_BASE_URL = "https://api.jikan.moe/v4";

// --- Rate Limiting ---
const RATE_LIMITS = {
  PER_SECOND:{
    max: 3,
    windowMs: 1000,
  },
  PER_MINUTE: {
    max: 60,
    windowMs: 60000,
  }
}
const rateLimit = {
  secondWindow: {
    requests: 0,
    resetTime: Date.now() + RATE_LIMITS.PER_SECOND.windowMs,
  },
  minuteWindow: {
    requests: 0,
    resetTime: Date.now() + RATE_LIMITS.PER_MINUTE.windowMs,
  }
 }

 // --- Cache Simples ---

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  data: any;
  expiry: number;
  lastModified: string;
  fingerprint?: string;
}

const cache = new Map<string, CacheEntry>();

// --- Rate Limiting Logic ---
const checkRateLimits = async (): Promise<void> => {
  const now = Date.now();

  // Reset second window if needed
  if (now > rateLimit.secondWindow.resetTime) {
    rateLimit.secondWindow.requests = 0;
    rateLimit.secondWindow.resetTime = now + RATE_LIMITS.PER_SECOND.windowMs;
  }

  // Reset minute window if needed
  if (now > rateLimit.minuteWindow.resetTime) {
    rateLimit.minuteWindow.requests = 0;
    rateLimit.minuteWindow.resetTime = now + RATE_LIMITS.PER_MINUTE.windowMs;
  }

  // Check if we need to wait
  if (rateLimit.secondWindow.requests >= RATE_LIMITS.PER_SECOND.max) {
    const waitTime = rateLimit.secondWindow.resetTime - now;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return checkRateLimits();
  }

  if (rateLimit.minuteWindow.requests >= RATE_LIMITS.PER_MINUTE.max) {
    const waitTime = rateLimit.minuteWindow.resetTime - now;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return checkRateLimits();
  }

  // Increment counters
  rateLimit.secondWindow.requests++;
  rateLimit.minuteWindow.requests++;
};

// --- Cache Functions ---
const getCache = (key: string): CacheEntry | null => {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached;
  }
  cache.delete(key);
  return null;
};

const setCache = (key: string, data: any, headers: any): void => {
  const expiry = Date.now() + CACHE_DURATION_MS;
  const entry: CacheEntry = {
    data,
    expiry,
    lastModified: headers['last-modified'] || new Date().toISOString(),
    fingerprint: headers['x-request-fingerprint']
  };
  cache.set(key, entry);
};

// --- Axios Instance com Retry ---
const api = axios.create({
  baseURL: JIKAN_API_BASE_URL,
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Tentativa de retry: ${retryCount}`);
    return retryCount * 1000; // 1s, 2s, 3s...
  },
  retryCondition: (error) =>
    error.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error),
});

// --- Função Auxiliar de Requisição ---
const fetchData = async (url: string, useCache = true): Promise<any> => {
  if (useCache) {
    const cachedResponse = getCache(url);
    if (cachedResponse) {
      return {
        data: cachedResponse.data,
        cached: true,
        lastModified: cachedResponse.lastModified,
        fingerprint: cachedResponse.fingerprint
      };
    }
  }

  await checkRateLimits();

  try {
    const response = await api.get(url);
    
    if (response.status >= 200 && response.status < 300) {
      if (useCache) {
        setCache(url, response.data, response.headers);
      }
      return {
        data: response.data,
        cached: false,
        lastModified: response.headers['last-modified'],
        fingerprint: response.headers['x-request-fingerprint']
      };
    } else {
      throw new Error(`API Error: ${response.status} - ${response.statusText} for URL: ${url}`);
    }
  } catch (error: any) {
    if (error.response?.status === 429) {
      // Handle rate limit exceeded
      const retryAfter = error.response.headers['retry-after'] || 60;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchData(url, useCache);
    }
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// --- Funções de API ---

export const searchAnime = async (query: string, page = 1) => {
  const encodedQuery = encodeURIComponent(query);
  return fetchData(`/anime?q=${encodedQuery}&page=${page}`);
};

export const getAnimeDetails = async (id: number) => {
  return fetchData(`/anime/${id}/full`);
};

export const getAnimeCharacters = async (id : number) => {
  return fetchData(`/anime/${id}/characters`);
};

export const getAnimeStaff = async (id : number) => {
  return fetchData(`/anime/${id}/staff`);
};

export const getTopAnime = async (page = 1) => {
  return fetchData(`/top/anime?page=${page}`);
};


export const getSeasonalAnime = async (year: number, season: string) => {
  return fetchData(`/seasons/${year}/${season}`);
};

export const getAnimeEpisodes = async (id: number) => {
  return fetchData(`/anime/${id}/episodes`);
}

export const getAnimeEpisodesById = async (id: number, episode: number) => {
  return fetchData(`/anime/${id}/episodes/${episode}`);
}

export const getAnimeNews = async (id : number) => {
  return fetchData(`/anime/${id}/news`);
}

export const getRandomAnime = async () => {
  return fetchData(`/random/anime`);
};

export const getTopManga = async (p0: number) => {
  return fetchData(`/top/manga`);
};

 export const getAnimePictures = async (id: number) => {
  return fetchData(`/anime/${id}/pictures`);
};

export const getAnimeStreaming = async (id: number) => {
  return fetchData(`/anime/${id}/streaming`);
}

export const getAnimeRelations = async (id: number) => {
  return fetchData(`/anime/${id}/relations`);
};

export const getAnimeRecommendations = async (id: number) => {
  return fetchData(`/anime/${id}/recommendations`);
};

export const getAnimeStatistics = async (id: number) => {
  return fetchData(`/anime/${id}/statistics`);
};

export const getAnimeReviews = async (id: number, page = 1) => {
  return fetchData(`/anime/${id}/reviews?page=${page}`);
};

export const getAnimeForum = async (id: number) => {
  return fetchData(`/anime/${id}/forum`);
};

export const getAnimeMoreInfo = async (id: number) => {
  return fetchData(`/anime/${id}/moreinfo`);
};

// Detalhes do Mangá
export const getMangaDetails = async (id: number) => {
  return fetchData(`/manga/${id}/full`);
};

// Personagens do Mangá
export const getMangaCharacters = async (id: number) => {
  return fetchData(`/manga/${id}/characters`);
};

// Imagens do Mangá
export const getMangaPictures = async (id: number) => {
  return fetchData(`/manga/${id}/pictures`);
};

// Recomendações de Mangá
export const getMangaRecommendations = async (id: number) => {
  return fetchData(`/manga/${id}/recommendations`);
};

// Estatísticas de Mangá
export const getMangaStatistics = async (id: number) => {
  return fetchData(`/manga/${id}/statistics`);
};

export const getCharacterDetails = async (id: number) => {
  return fetchData(`/characters/${id}/full`);
};

export const getPersonDetails = async (id: number) => {
  return fetchData(`/people/${id}/full`);
};

export const getSchedule = async (day?: string) => {
  // Se quiser buscar por dia específico, ex: /schedules/monday
  const url = day ? `/schedules/${day}` : `/schedules`;
  return fetchData(url);
};

export const getProducers = async (page = 1) => {
  return fetchData(`/producers?page=${page}`);
};

export const getProducerDetails = async (producerId: number) => {
  return fetchData(`/producers/${producerId}`);
};

export const getAnimeGenres = async () => {
  return fetchData(`/genres/anime`);
};

export const getTopAnimeByType = async (type: string, page = 1) => {
  return fetchData(`/top/anime?type=${type}&page=${page}`);
};
