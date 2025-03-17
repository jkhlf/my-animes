'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAnimeStore } from "@/app/lib/store";



export default function AnimeGrid({ listType, animeList = null }) {
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getAnimeByStatus, getAllAnime } = useAnimeStore();

    useEffect(() => {
        const fetchAnime = async () => {
            setLoading(true)
            try {
                if (animeList) {
                    setAnime(animeList)
                } else if (listType === "trending") {
                    const response = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity")
                    const data = await response.json()
                    setAnime(data.data)
                } else {
                    const userAnime = getAnimeByStatus(listType)
                    setAnime(userAnime)
                }
            } catch (error) {
                console.error("Error fetching", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnime()
    }, [listType, animeList, getAnimeByStatus])

    if (loading) {
        return <p>Loading anime...</p>
    }

    if (anime.length === 0) {
        return (
            <div className="text-center py-12">
                <p> {listType === "trending" ? "Unable to load trending anime." : `No anime in your ${listType} list yet.`}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {anime.map((item) => {
                const id = item.mal_id || item.id
                const title = item.title
                const image = item.images?.jpg?.image_url || item.image
                const episodes = item.episodes || 0
                const watchedEpisodes = item.watchEpisodes || 0
                const progress = episodes ? Math.round(watchedEpisodes / episodes * 100) : 0

                return (
                    <Link key={id}
                        href={`/anime/${id}`}
                        className="">
                        <div className="relative aspect-[2/3] w-full overflow-hidden">
                            <Image
                                src={image || ""}
                                alt={title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="p-2">
                            <h3 className="line-clamp-2 text-sm font-semibold">
                                {title}
                            </h3>

                            {watchedEpisodes > 0 && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-sx mb-1">
                                        <span>{watchedEpisodes}/{episodes || "?"}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-1" />
                                </div>
                            )}
                        </div>
                    </Link>
                )
            })}
        </div>
    )

}