import { BookmarkCheck, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
          <TabsTrigger value='watching'>Completed</TabsTrigger>
          <TabsTrigger value='watching'>Plan to Watch</TabsTrigger>
          <TabsTrigger value='watching'>On Hold</TabsTrigger>
          <TabsTrigger value='watching'>Dropped</TabsTrigger>
          </TabsList>
          
        </Tabs>
      </TabsContent>






    </Tabs>
    

    </div>
  )
}
