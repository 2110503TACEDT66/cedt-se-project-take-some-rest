import SuspenseUI from '@/components/basic/SuspenseUI'
import SearchBar from '@/components/basic/search/SearchBar'
import CampgroundPanelCampgrounds from '@/components/complex/CampgroundPanelCampgrounds'
import getCampgrounds from '@/libs/campgrounds/getCampgrounds'
import { Suspense } from 'react'

export default async function Campgrounds() {
  const campgrounds: CampgroundsJson = await getCampgrounds()

  return (
    <main className='px-5 pt-7'>
      <div className='flex justify-between items-center mb-6'>
        <div className='text-4xl font-bold z-30 text-cgr-black align-middle'>
          Campgrounds
        </div>
        <SearchBar />
      </div>
      <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
      <CampgroundPanelCampgrounds campgrounds={campgrounds.data} />
    </main>
  )
}
