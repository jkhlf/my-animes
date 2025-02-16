import { getAnimeDetails, getAnimeCharacters, getAnimeStaff } from "@/services/api/jikan-api"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2 } from "lucide-react"
import type { Anime, AnimeCharacters, AnimeStaff } from "@/types"

async function getAnimeData(id: number) {
  try {
    const [details, characters, staff] = await Promise.all([
      getAnimeDetails(id),
      getAnimeCharacters(id),
      getAnimeStaff(id),
      // Caso queira buscar as imagens extras do anime:
      // getAnimePictures(id)
    ]);

    return {
      anime: details.data.data as Anime,
      characters: characters.data.data as AnimeCharacters[],
      staff: staff.data.data as AnimeStaff[],
      // pictures: pictures.data, ...
    };
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return {
      anime: null,
      related: [],
      characters: [],
      staff: [],
      // pictures: [],
    };
  }
}

export default async function AnimePage({ params }: { params: { animeId: string } }) {
  const { anime, characters, staff } = await getAnimeData(Number(params.animeId));

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

  // Exemplo de array “falso” de galeria
  // Em produção, você pode buscar as imagens extras via Jikan (pictures)
  const galleryImages = [
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
    anime.images.jpg.large_image_url,
  ];

  // Monta string de gêneros para exibir tipo "Adventure / Mystery"
  const genreString = anime.genres?.map((g) => g.name).join(" / ") || "";
  // Se quiser adicionar os "themes" nessa string, basta concatenar:
  // const genreString = [...anime.genres, ...anime.themes]
  //   ?.map((item) => item.name)
  //   .join(" / ") || "";

  return (
    <div className="min-h-screen w-full bg-[#121214] text-white font-sans">
      {/* HERO */}
      <header className="relative w-full h-[60vh] md:h-[70vh]">
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
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 md:max-w-[60%]">
          {/* Título grande */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
            {anime.title}
          </h1>
          {/* Informações resumidas: Ano | Tipo | Episódios | Temporada | País */}
          <p className="text-gray-300 text-xs md:text-sm mb-1">
            {anime.year} | {anime.type} | Episodes {anime.episodes ?? "?"} | Season:{" "}
            {anime.season ?? "?"} | Country: 
          </p>

          {/* Gêneros (Adventure / Mystery) */}
          {genreString && (
            <div className="flex space-x-2 mb-2">
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
          <p className="text-gray-200 text-sm md:text-base line-clamp-3">
            {anime.synopsis}
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Seção de Galeria (conforme a imagem de referência) */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-video rounded-md overflow-hidden"
              >
                <Image src={src} alt={`Gallery ${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Exemplos de ícones abaixo da galeria (coração, compartilhar, etc.) */}
        <div className="flex gap-4 mt-4 md:mt-6">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
            Favorite
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            Share
          </button>
        </div>

        {/* Você pode parar por aqui para ficar “igual” à imagem de ref.
            Abaixo, mantenho seções adicionais (Characters, Staff, etc.),
            caso queira exibir mais conteúdo, mas ainda no estilo “escuro”. */}

        {/* Trailer (opcional) */}
        {anime.trailer.youtube_id && (
          <section className="mt-8 md:mt-10">
            <h3 className="text-lg font-semibold mb-4">Trailer</h3>
            <div className="relative aspect-video">
              <iframe
                className="w-full h-full rounded-md"
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Characters */}
        {characters.length > 0 && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg font-semibold mb-4">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {characters.slice(0, 8).map((char) => (
                <div
                  key={char.character.mal_id}
                  className="bg-white/5 rounded-md p-2"
                >
                  <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                    <Image
                      src={char.character.images.jpg.image_url}
                      alt={char.character.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">
                      {char.character.name}
                    </p>
                    <p className="text-white/60 text-xs">{char.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Staff */}
        {staff.length > 0 && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg font-semibold mb-4">Staff</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {staff.slice(0, 8).map((member) => (
                <div
                  key={`${member.person.mal_id}-${member.positions[0]}`}
                  className="bg-white/5 rounded-md p-2"
                >
                  <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                    <Image
                      src={member.person.images.jpg.image_url}
                      alt={member.person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">
                      {member.person.name}
                    </p>
                    <p className="text-white/60 text-xs">
                      {member.positions[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Theme Songs */}
        {(anime.theme?.openings?.length > 0 || anime.theme?.endings?.length > 0) && (
          <section className="mt-8 md:mt-10">
            <h2 className="text-lg font-semibold mb-4">Theme Songs</h2>
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
      </main>
    </div>
  );
}