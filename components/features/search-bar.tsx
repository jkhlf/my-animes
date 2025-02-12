"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { SearchResult } from "@/types"


export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.data.slice(0, 10))
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Search anime..."
          className="w-full bg-white/10 text-white placeholder-white/50 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
      </div>

      {/* Results Dropdown */}
      {showResults && query.length >= 3 && (
        <div
          className="absolute w-full mt-2 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
          onMouseLeave={() => setShowResults(false)}
        >
          {isLoading ? (
            <div className="p-4 text-white/70">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((anime) => (
                <Link
                  key={anime.mal_id}
                  href={`/anime/${anime.mal_id}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors"
                >
                  <img
                    src={anime.images.jpg.small_image_url || "/placeholder.svg"}
                    alt={anime.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium line-clamp-1">{anime.title}</h3>
                    <p className="text-white/50 text-xs">
                      {anime.type} {anime.year ? `(${anime.year})` : ""}
                    </p>
                  </div>
                </Link>
              ))}
              {results.length === 10 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="block px-4 py-2 text-sm text-blue-400 hover:text-blue-300 text-center border-t border-white/10"
                >
                  View all results
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 text-white/70">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

