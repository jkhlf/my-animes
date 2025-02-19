import {
  getAnimeDetails,
  getAnimeCharacters,
  getAnimeStaff,
  getAnimePictures,
  getAnimeStreaming,
  getAnimeStatistics,
  getAnimeRecommendations,
  getAnimeRelations,
  getAnimeReviews
} from "@/services/api/jikan-api"

import Image from "next/image"
import Link from "next/link"
import { Heart, Share2 } from "lucide-react"
import type {
  Anime,
  AnimeCharacters,
  AnimeStaff,
  AnimePictures,
  AnimeStreaming,
} from "@/types"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

/** 
 * Busca todos os dados necessários do anime (detalhes, personagens, staff, imagens e streaming).
 * Caso ocorra algum erro em uma das requisições, retornamos arrays vazios e null para o anime.
 */
async function getAnimeData(id: number) {
  try {
    const [
      details,
      characters,
      staff,
      pictures,
      streaming,
      statistics,
      recommendations,
      relations,
      reviews
    ] = await Promise.all([
      getAnimeDetails(id),
      getAnimeCharacters(id),
      getAnimeStaff(id),
      getAnimePictures(id),
      getAnimeStreaming(id),
      getAnimeStatistics(id),
      getAnimeRecommendations(id),
      getAnimeRelations(id),
      getAnimeReviews(id)
    ]);

    return {
      anime: details.data.data as Anime,
      characters: characters.data.data as AnimeCharacters[],
      staff: staff.data.data as AnimeStaff[],
      pictures: pictures.data.data as AnimePictures[],
      streaming: streaming.data.data as AnimeStreaming[],
      statistics: statistics.data.data,
      recommendations: recommendations.data.data,
      relations: relations.data.data,
      reviews: reviews.data.data
    };
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return {
      anime: null,
      characters: [],
      staff: [],
      pictures: [],
      streaming: [],
      statistics: null,
      recommendations: [],
      relations: [],
      reviews: []
    };
  }
}

export default async function AnimePage({ params }: { params: { animeId: string } }) {
  const { anime, characters, staff, pictures, streaming, statistics, recommendations, relations, reviews } = await getAnimeData(
    Number(params.animeId)
  );

  // Se o anime não for encontrado, exibe uma tela de erro simples.
  if (!anime) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Monta a galeria com as imagens extras retornadas pelo endpoint de pictures.
   * Caso não haja imagens extras, utiliza a imagem principal do anime.
   */
  const galleryImages =
    pictures && pictures.length > 0
      ? pictures
          .map((pic) => pic.images?.jpg?.image_url)
          .filter(Boolean) // Remove possíveis undefined
      : [anime.images.jpg.large_image_url];

  /**
   * Cria uma string de gêneros para exibir, por exemplo: "Adventure / Mystery".
   * Se quiser incluir também themes (ex: "Samurai", "Historical"), basta concatenar
   * ao array de gêneros antes do map.
   */
  const genreString =
    anime.genres?.map((genre) => genre.name).join(" / ") || "";

  return (
    <div className="min-h-screen w-full bg-[#121214] text-white font-sans">
      {/* HERO */}
      <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradiente para escurecer o rodapé da imagem */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]" />

        {/* Bloco de texto sobreposto no canto inferior esquerdo */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 md:max-w-[60%] z-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight drop-shadow-md">
            {anime.title}
          </h1>

          {/* Informações resumidas: Ano | Tipo | Episódios | Temporada */}
          <p className="text-gray-300 text-xs md:text-sm mb-1 drop-shadow-sm">
            {anime.year} | {anime.type} | Episodes {anime.episodes ?? "?"} | Season:{" "}
            {anime.season ?? "?"}
          </p>

          {/* Gêneros (Adventure / Mystery) */}
          {genreString && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-gray-700/50 text-gray-300 text-xs md:text-sm px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Sinopse com limite de 3 linhas (line-clamp) */}
          <p className="text-gray-200 text-sm md:text-base line-clamp-3 drop-shadow-sm">
            {anime.synopsis}
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* GALERIA */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-video rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <Image
                  src={src}
                  alt={`Gallery ${idx}`}
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ÍCONES (FAVORITAR, COMPARTILHAR) */}
        <div className="flex gap-4 mt-4 md:mt-6">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Favorite</span>
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Share</span>
          </button>
        </div>

        {/* ONDE ASSISTIR (STREAMING) */}
        {streaming && streaming.length > 0 && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Where to Watch</h2>
            <ul className="space-y-2">
              {streaming.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* TRAILER (SE EXISTIR) */}
        {anime.trailer.youtube_id && (
          <section className="mt-8 md:mt-10">
            <h3 className="text-lg font-semibold mb-4">Trailer</h3>
            <div className="relative aspect-video rounded-md overflow-hidden shadow-md">
              <iframe
                className="w-full h-full border-none"
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* CHARACTERS */}
        {characters.length > 0 && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {characters.slice(0, 8).map((char) => (
                <div
                  key={char.character.mal_id}
                  className="bg-white/5 rounded-md p-2 flex flex-col items-center text-center shadow hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square w-full rounded-md overflow-hidden mb-2">
                    <Image
                      src={char.character.images.jpg.image_url}
                      alt={char.character.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white font-medium text-sm">{char.character.name}</p>
                  <p className="text-white/60 text-xs">{char.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STAFF */}
        {staff.length > 0 && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Staff</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {staff.slice(0, 8).map((member) => (
                <div
                  key={`${member.person.mal_id}-${member.positions[0]}`}
                  className="bg-white/5 rounded-md p-2 flex flex-col items-center text-center shadow hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square w-full rounded-md overflow-hidden mb-2">
                    <Image
                      src={member.person.images.jpg.image_url}
                      alt={member.person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white font-medium text-sm">{member.person.name}</p>
                  <p className="text-white/60 text-xs">{member.positions[0]}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* THEME SONGS (ABERTURA E ENCERRAMENTO) */}
        {(anime.theme?.openings?.length > 0 || anime.theme?.endings?.length > 0) && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Theme Songs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {anime.theme.openings?.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Openings</h3>
                  <ul className="space-y-2 text-white/80 text-sm list-disc list-inside">
                    {anime.theme.openings.map((opening, index) => (
                      <li key={index}>{opening}</li>
                    ))}
                  </ul>
                </div>
              )}
              {anime.theme.endings?.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Endings</h3>
                  <ul className="space-y-2 text-white/80 text-sm list-disc list-inside">
                    {anime.theme.endings.map((ending, index) => (
                      <li key={index}>{ending}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Statistics Section */}
        {statistics && (
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Watching</p>
                <p className="text-xl font-bold">{statistics.watching.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-bold">{statistics.completed.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Plan to Watch</p>
                <p className="text-xl font-bold">{statistics.plan_to_watch.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-xl font-bold">{statistics.total.toLocaleString()}</p>
              </div>
            </div>
          </section>
        )}

        {/* Related Anime */}
        {relations.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Related Anime</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relations.map((relation: { entry: { mal_id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; relation: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                
                <><Link
                  key={relation.entry.mal_id}
                  href={`/anime/${relation.entry.mal_id}`}
                  className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                >
                  <p className="font-medium">{relation.entry.name}</p>
                  <p className="text-sm text-gray-400">{relation.relation}</p>
                </Link></>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review: { mal_id: Key | null | undefined; user: { username: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; score: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; review: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                <div key={review.mal_id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{review.user.username}</p>
                    <p className="text-sm text-gray-400">Score: {review.score}</p>
                  </div>
                  <p className="text-sm line-clamp-3">{review.review}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
