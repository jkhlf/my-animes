"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Anime, CarouselItem } from "@/types"

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/seasons/now')
        const data = await response.json()
        
        const topAnimes = data.data.slice(0, 5).map((anime: Anime) => ({
          id: anime.mal_id,
          imageUrl: anime.images.webp.large_image_url,
          title: anime.title,
          subtitle: anime.status,
          date: anime.aired.from
        }))

        setCarouselItems(topAnimes)
      } catch (error) {
        console.error('Erro ao buscar dados dos animes:', error)
      }
    }

    fetchAnimeData()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl">
      {/* Carrossel Principal */}
      <div className="relative w-full h-full">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
              <div className="absolute bottom-8 left-8 text-white">
                <div className="bg-black/80 inline-block px-4 py-1 mb-4 text-sm">
                  Destaque
                </div>
                <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
                {item.subtitle && (
                  <p className="text-xl mb-2">{item.subtitle}</p>
                )}
                {item.date && (
                  <p className="text-lg font-medium">{item.date}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de Navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
        aria-label="Próximo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Navegação por Pontos */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}