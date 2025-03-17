"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAnimeStore } from "@/app/lib/store";


export default function AnimeRating({animeId}) {
    const {getAnimeInList, updateAnimeScore} = useAnimeStore();
    const userAnime = getAnimeInList(animeId)
    const [rating, setRating] = useState(userAnime?.score || 0)
    const [hoverRating, setHoverRating] = useState(0)


}