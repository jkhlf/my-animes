"use client";

import {create} from "zustand"
import {persist} from "zustand/middleware"


interface AnimeItem {
    id: number
    title:String
    image: String
    episodes: number
    watchedEpisodes: number
    status: "watching" | "completed" | "on-hold" | "dropped" | "plan-to-watch"
    score: number
    notes: string
}

interface AnimeStore{
    animeList: AnimeItem[]
    addToList: (anime: AnimeItem) => void
    removeFromList: (id: number) => void
    updateWatchedEpisodes: (id:number, count: number) => void
    updateAnimeStatus: (id: number, status: AnimeItem["status"]) => void
    updateAnimeScore: (id: number, score: number) => void
    updateAnimeNotes: (id: number, notes: string) => void
    getAnimeInList: (id: number) => AnimeItem | undefined
    getAnimeByStatus: (status: string) => AnimeItem[]
    getAllAnime: () => AnimeItem[]
    importData: (data: AnimeItem[]) => void
}

export const useAnimeStore = create<AnimeStore>()(
    persist(
      (set, get) => ({
        animeList: [],
  
        addToList: (anime) =>
          set((state) => {
            // Check if anime already exists in the list
            const existingIndex = state.animeList.findIndex((item) => item.id === anime.id)
  
            if (existingIndex >= 0) {
              // Update existing anime
              const updatedList = [...state.animeList]
              updatedList[existingIndex] = {
                ...updatedList[existingIndex],
                status: anime.status,
              }
              return { animeList: updatedList }
            } else {
              // Add new anime
              return { animeList: [...state.animeList, anime] }
            }
          }),
  
        removeFromList: (id) =>
          set((state) => ({
            animeList: state.animeList.filter((anime) => anime.id !== id),
          })),
  
        updateWatchedEpisodes: (id, count) =>
          set((state) => {
            const updatedList = state.animeList.map((anime) => {
              if (anime.id === id) {
                const status = anime.episodes > 0 && count >= anime.episodes ? "completed" : anime.status
  
                return { ...anime, watchedEpisodes: count, status }
              }
              return anime
            })
  
            return { animeList: updatedList }
          }),
  
        updateAnimeStatus: (id, status) =>
          set((state) => ({
            animeList: state.animeList.map((anime) => (anime.id === id ? { ...anime, status } : anime)),
          })),
  
        updateAnimeScore: (id, score) =>
          set((state) => ({
            animeList: state.animeList.map((anime) => (anime.id === id ? { ...anime, score } : anime)),
          })),
  
        updateAnimeNotes: (id, notes) =>
          set((state) => ({
            animeList: state.animeList.map((anime) => (anime.id === id ? { ...anime, notes } : anime)),
          })),
  
        getAnimeInList: (id) => {
          return get().animeList.find((anime) => anime.id === id)
        },
  
        getAnimeByStatus: (status) => {
          return get().animeList.filter((anime) => anime.status === status)
        },
  
        getAllAnime: () => {
          return get().animeList
        },
  
        importData: (data) => set({ animeList: data }),
      }),
      {
        name: "anime-tracker-storage",
      },
    ),
  )