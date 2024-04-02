import SuspenseUI from '@/components/basic/SuspenseUI'
import CampgroundPanelCampgrounds from '@/components/complex/CampgroundPanelCampgrounds'
import getCampgrounds from '@/libs/campgrounds/getCampgrounds'
import { Suspense } from 'react'

export default async function Campgrounds() {
  const campgrounds: CampgroundsJson = await getCampgrounds()

  return (
    <main className='px-5 pt-7'>
      <div className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
        Campgrounds
      </div>
      <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
      <CampgroundPanelCampgrounds campgrounds={campgrounds.data} />
    </main>
  )
}
