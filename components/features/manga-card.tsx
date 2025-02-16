import Image from "next/image"
import Link from "next/link"
import type { MangaCardProps } from "@/types"

export default function MangaCard({ id, title, imageUrl, releaseDate }: MangaCardProps) {
  return (
    <Link href={`/manga/${id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-600">{releaseDate}</p>
    </Link>
  )
}
