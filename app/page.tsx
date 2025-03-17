import { BookmarkCheck, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from '@/components/ui/card'


export const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>AnimeTracker</h1>
          <p> Text nice here </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/search'>
            <button>
              <Search className='h-4 w-4' />
              <span className='sr-only'>Search</span>  
            </button>
          </Link>
          <Link href='profile'>
            <button> Profile </button>
          </Link>
        </div>
      </header>

    <Tabs defaultValue='my-lists' className='w-full'>
      <TabsList className='grid grid-cols-4 mb-8'>
          <TabsTrigger value='my-lists'>
            <BookmarkCheck className='h-4 w-4 mr-2' />
            My Lists
          </TabsTrigger>
          <TabsTrigger value='trending'>
            <BookmarkCheck className='h-4 w-4 mr-2' />
            Trending
          </TabsTrigger>
          <TabsTrigger value='seasonal'>
            <BookmarkCheck className='h-4 w-4 mr-2' />
            Seasonal
          </TabsTrigger>
          <TabsTrigger value='stats'>
            Stats
          </TabsTrigger>
      </TabsList>

      <TabsContent value='my-lists' className='space-y-6'>
        <Tabs defaultValue='watching' className='w-full'>
          <TabsList className='w-full justify-start mb-4'>
          <TabsTrigger value='watching'>Watching</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
          <TabsTrigger value='plan-to-watch'>Plan to Watch</TabsTrigger>
          <TabsTrigger value='on-hold'>On Hold</TabsTrigger>
          <TabsTrigger value='dropped'>Dropped</TabsTrigger>
          </TabsList>

          <TabsContent value='watching'>
              <AnimeGrid listType='watching' />
          </TabsContent>

          <TabsContent value='completed'>
              <AnimeGrid listType='completed' />
          </TabsContent>

          <TabsContent value='plan-to-watch'>
              <AnimeGrid listType='plan-to-watch' />
          </TabsContent>
          
          <TabsContent value='on-hold'>
              <AnimeGrid listType='on-hold' />
          </TabsContent>
          
          <TabsContent value='dropped'>
              <AnimeGrid listType='dropped' />
          </TabsContent>

        </Tabs>
      </TabsContent>

      <TabsContent value='trending'>
        <Card>
          <CardContent className='pt-6'>
              <SeasonalAnime />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='stats'>
        <Card>
          <CardContent className='pt-6'>
              <UserStats/>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}
