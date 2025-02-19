import {
  getMangaDetails,
  getMangaCharacters,
  getMangaPictures,
  getMangaRecommendations,
  getMangaStatistics
} from "@/services/api/jikan-api";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Users, Star, BarChart } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

async function getMangaData(id: number) {
  try {
    const [details, characters, pictures, recommendations, statistics] = 
      await Promise.all([
        getMangaDetails(id),
        getMangaCharacters(id),
        getMangaPictures(id),
        getMangaRecommendations(id),
        getMangaStatistics(id)
      ]);

    return {
      manga: details.data.data,
      characters: characters.data.data,
      pictures: pictures.data.data,
      recommendations: recommendations.data.data,
      statistics: statistics.data.data
    };
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return {
      manga: null,
      characters: [],
      pictures: [],
      recommendations: [],
      statistics: null
    };
  }
}

export default async function MangaPage({ params }: { params: { mangaId: string } }) {
  const { manga, characters, pictures, recommendations, statistics } = 
    await getMangaData(Number(params.mangaId));

  if (!manga) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Manga not found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#121214] text-white">
      <header className="relative w-full h-[60vh] overflow-hidden">
        <Image
          src={manga.images.jpg.large_image_url}
          alt={manga.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]" />
        
        <div className="absolute bottom-8 left-8 right-8 max-w-[60%]">
          <h1 className="text-4xl font-bold mb-4">{manga.title}</h1>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{manga.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{manga.members.toLocaleString()} members</span>
            </div>
          </div>
          <p className="text-sm text-gray-300 line-clamp-3">{manga.synopsis}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-300">{manga.synopsis}</p>
            </section>

            {/* Characters */}
            {characters.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Characters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {characters.slice(0, 6).map((char: { character: { mal_id: Key | null | undefined; images: { jpg: { image_url: string | StaticImport; }; }; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; role: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <div key={char.character.mal_id} className="bg-white/5 rounded-lg p-4">
                      <div className="relative h-40 mb-2">
                        <Image
                          src={char.character.images.jpg.image_url}
                          alt={String(char.character.name)}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <h3 className="font-medium">{char.character.name}</h3>
                      <p className="text-sm text-gray-400">{char.role}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400">Format</p>
                  <p>{manga.type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p>{manga.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">Chapters</p>
                  <p>{manga.chapters || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Volumes</p>
                  <p>{manga.volumes || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Published</p>
                  <p>{manga.published.string}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Reading</span>
                    <span>{statistics.reading.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <span>{statistics.completed.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Plan to Read</span>
                    <span>{statistics.plan_to_read.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
