import Image from "next/image"
import Link from "next/link"
import type { MangaCardProps } from "@/types"

export default function MangaCard({ id, title, imageUrl, releaseDate }: MangaCardProps) {
  // Formata a data para pt-BR (ex: "15 de fevereiro de 2025")
  let dateString = releaseDate
  try {
    const date = new Date(releaseDate)
    if (!isNaN(date.getTime())) {
      dateString = date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
  } catch (error) {
    // Caso a data seja inválida, mantemos releaseDate como está
    console.warn("Data inválida:", error)
  }

  return (
    <Link
      href={`/manga/${id}`}
      className="
        group
        relative
        block
        rounded-lg
        overflow-hidden
        bg-white/5
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="
            object-cover
            transform
            group-hover:scale-110
            transition-transform
            duration-700
          "
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-white line-clamp-2 mb-2">
          {title}
        </h3>
        <p className="text-sm text-white/70">
          {dateString}
        </p>
      </div>
    </Link>
  )
}
