import { getAnimeDetails, getRelatedAnime, getAnimeCaracteres, getAnimeStaff } from "@/services/api/jikan-api"
import Image from "next/image"
import Link from "next/link"
import { Star, Calendar, Play, Info, Clock, Users, Youtube } from "lucide-react"
import type { Anime, AnimeCaracteres, AnimeStaff, RelatedAnimeEntry } from "@/types"

async function getAnimeData(id: number) {
  try {
    const [details, related, characters, staff] = await Promise.all([
      getAnimeDetails(id),
      getRelatedAnime(id),
      getAnimeCaracteres(id),
      getAnimeStaff(id)
    ]);

    return {
      anime: details.data.data as Anime,
      related: related.data as RelatedAnimeEntry[],
      characters: characters.data.data as AnimeCaracteres[],
      staff: staff.data.data as AnimeStaff[]
    };
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return {
      anime: null,
      related: [],
      characters: [],
      staff: []
    };
  }
}

export default async function AnimePage({ params }: { params: { animeId: string } }) {
  const { anime, related, characters, staff } = await getAnimeData(Number(params.animeId));

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            fill
            className="object-cover blur-sm opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative h-full">
          <div className="absolute bottom-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{anime.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/80">
              {anime.score && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{anime.score} ({anime.scored_by.toLocaleString()} votes)</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{anime.year || "N/A"}</span>
              </div>
              {anime.episodes && (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span>{anime.episodes} Episodes</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{anime.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{anime.members.toLocaleString()} Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Trailer Section */}
            {anime.trailer.youtube_id && (
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  Trailer
                </h3>
                <div className="relative aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Information Box */}
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">Information</h3>
              <div className="space-y-2 text-white/80">
                <div><strong>Type:</strong> {anime.type}</div>
                <div><strong>Status:</strong> {anime.status}</div>
                <div><strong>Aired:</strong> {anime.aired.from}</div>
                <div><strong>Season:</strong> {anime.season} {anime.year}</div>
                <div><strong>Broadcast:</strong> {anime.broadcast?.string}</div>
                <div><strong>Studios:</strong> {anime.studios?.map(s => s.name).join(", ") || "N/A"}</div>
                <div><strong>Source:</strong> {anime.source}</div>
                <div><strong>Genres:</strong> {anime.genres?.map(g => g.name).join(", ")}</div>
                <div><strong>Theme:</strong> {anime.themes?.map(t => t.name).join(", ")}</div>
                <div><strong>Demographics:</strong> {anime.demographics?.map(d => d.name).join(", ")}</div>
                <div><strong>Rating:</strong> {anime.rating}</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Synopsis */}
            <section className="bg-white/5 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Synopsis</h2>
              <p className="text-white/80 leading-relaxed">{anime.synopsis}</p>
            </section>

            {/* Characters */}
            {characters.length > 0 && (
              <section className="bg-white/5 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Characters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {characters.slice(0, 8).map((char) => (
                    <div key={char.character.mal_id} className="bg-white/5 rounded-lg p-2">
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                        <Image
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium text-sm">{char.character.name}</p>
                        <p className="text-white/60 text-xs">{char.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Staff */}
            {staff.length > 0 && (
              <section className="bg-white/5 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Staff</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {staff.slice(0, 8).map((member) => (
                    <div key={`${member.person.mal_id}-${member.positions[0]}`} className="bg-white/5 rounded-lg p-2">
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                        <Image
                          src={member.person.images.jpg.image_url}
                          alt={member.person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium text-sm">{member.person.name}</p>
                        <p className="text-white/60 text-xs">{member.positions[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Anime */}
            {related.length > 0 && (
              <section className="bg-white/5 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Related Anime</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((item) => (
                    <Link
                      key={item.mal_id}
                      href={`/anime/${item.mal_id}`}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Info className="w-5 h-5 text-white/60" />
                      <span className="text-white/80">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Theme Songs */}
            {(anime.theme?.openings?.length > 0 || anime.theme?.endings?.length > 0) && (
              <section className="bg-white/5 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Theme Songs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {anime.theme.openings?.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Openings</h3>
                      <ul className="space-y-2 text-white/80">
                        {anime.theme.openings.map((opening, index) => (
                          <li key={index} className="text-sm">{opening}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {anime.theme.endings?.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Endings</h3>
                      <ul className="space-y-2 text-white/80">
                        {anime.theme.endings.map((ending, index) => (
                          <li key={index} className="text-sm">{ending}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}