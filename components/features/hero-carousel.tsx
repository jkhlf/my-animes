"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { Anime, CarouselItem } from "@/types"

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/seasons/now")
        const data = await response.json()

        const topAnimes = data.data.slice(0, 5).map((anime: Anime) => ({
          id: anime.mal_id,
          imageUrl: anime.images.webp.large_image_url,
          title: anime.title,
          subtitle: anime.status,
          date: anime.aired.from,
        }))

        setCarouselItems(topAnimes)
      } catch (error) {
        console.error("Erro ao buscar dados dos animes:", error)
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
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      {/* Slides (fade) */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out
            ${index === currentSlide ? "opacity-100 z-20" : "opacity-0 -z-10"}`}
        >
          {/* Imagem de fundo */}
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            priority={index === 0}
            quality={100}
            className="object-cover object-center"
          />

          {/* Gradiente lateral para leitura do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

          {/* Conteúdo do Slide */}
          <div className="relative z-30 h-full flex items-center max-w-[1200px] mx-auto px-8">
            <div className="w-full md:w-2/3 lg:w-1/2 space-y-4 text-white">
        
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-md">
                {item.title}
              </h2>

              {/* Subtitle e data formatada, se existirem */}
              {item.subtitle && (
                <p className="text-xl font-semibold drop-shadow-sm">
                  {item.subtitle}
                </p>
              )}
              {item.date && (
                <p className="text-lg drop-shadow-sm">
                  Lançamento: {new Date(item.date).toLocaleDateString("pt-BR")}
                </p>
              )}

              {/* Botões de ação */}
              <div className="flex items-center gap-3 mt-6">
                <button className="bg-white text-black px-5 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                  Assistir agora
                </button>
                <button className="bg-white/30 text-white px-4 py-2 rounded-md font-semibold hover:bg-white/50 transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Minha lista
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Botões de Navegação (esquerda/direita) */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-white hover:bg-black/80 transition-colors z-30"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-white hover:bg-black/80 transition-colors z-30"
        aria-label="Próximo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bolinhas de navegação (indicadores) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300
              ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
