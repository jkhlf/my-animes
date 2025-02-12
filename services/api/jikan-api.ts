import axios from 'axios';
import axiosRetry from 'axios-retry';

// --- Configurações Gerais ---
const JIKAN_API_BASE_URL = "https://api.jikan.moe/v4";

// --- Rate Limiting ---
let requestQueue: (() => void)[] = [];
let isProcessingQueue = false;
const MAX_REQUESTS_PER_MINUTE = 60;
const TIME_WINDOW_MS = 60000;
let requestCount = 0;
let resetTime = Date.now() + TIME_WINDOW_MS;

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const now = Date.now();
    if (now > resetTime) {
      requestCount = 0;
      resetTime = now + TIME_WINDOW_MS;
    }

    if (requestCount < MAX_REQUESTS_PER_MINUTE) {
      const nextRequest = requestQueue.shift();
      if (nextRequest) {
        requestCount++;
        nextRequest(); // Executa a requisição
      }
    } else {
      const waitTime = resetTime - now;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
  isProcessingQueue = false;
};

const enqueueRequest = (requestFn: () => Promise<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const response = await requestFn();
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        if (!isProcessingQueue) {
          processQueue();
        }
      }
    });
    if (!isProcessingQueue) {
      processQueue();
    }
  });
};

// --- Cache Simples ---
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_EXPIRATION_TIME_MS = 60 * 1000; // 1 minuto

const getCache = (key: string): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key: string, data: any) => {
  const expiry = Date.now() + CACHE_EXPIRATION_TIME_MS;
  cache.set(key, { data, expiry });
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
      return cachedResponse;
    }
  }

  try {
    const response = await enqueueRequest(() => api.get(url));
    if (response.status >= 200 && response.status < 300) {
      if (useCache) {
        setCache(url, response.data);
      }
      return response.data;
    } else {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText} para a URL: ${url}`);
    }
  } catch (error: any) {
    console.error(`Erro ao buscar ${url}:`, error);
    throw error;
  }
};

// --- Funções de API ---

/**
 * Pesquisa animes a partir de uma query.
 */
export const searchAnime = async (query: string, page = 1) => {
  const encodedQuery = encodeURIComponent(query);
  return fetchData(`/anime?q=${encodedQuery}&page=${page}`);
};

/**
 * Retorna os detalhes completos de um anime, dado o seu ID.
 */
export const getAnimeDetails = async (id: number) => {
  return fetchData(`/anime/${id}/full`);
};

/**
 * Retorna os animes mais populares (top anime) paginados.
 */
export const getTopAnime = async (page = 1) => {
  return fetchData(`/top/anime?page=${page}`);
};

/**
 * Retorna os animes sazonais para um ano e temporada específicos.
 */
export const getSeasonalAnime = async (year: number, season: string) => {
  return fetchData(`/seasons/${year}/${season}`);
};

/**
 * Retorna um anime aleatório.
 */
export const getRandomAnime = async () => {
  return fetchData(`/random/anime`);
};

/**
 * Retorna os animes relacionados a um determinado anime, filtrando entradas inválidas.
 */
export const getRelatedAnime = async (id: number) => {
  try {
    const data = await fetchData(`/anime/${id}/relations`, false); // opcional: não usar cache para dados possivelmente dinâmicos
    // Filtra entradas que possuam as informações necessárias
    const filteredData = {
      data: (data.data || []).filter(
        (item: any) =>
          item &&
          item.entry &&
          item.entry.mal_id !== undefined &&
          item.entry.title !== undefined
      ),
    };
    return filteredData;
  } catch (error) {
    console.error("Falha ao buscar animes relacionados:", error);
    return { data: [] };
  }
};
