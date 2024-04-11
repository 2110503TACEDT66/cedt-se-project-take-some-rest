'use client'

import { useEffect, useState } from 'react'

import SuspenseUI from '@/components/basic/SuspenseUI'
import SearchBar from '@/components/basic/search/SearchBar'
import CampgroundPanelCampgrounds from '@/components/complex/CampgroundPanelCampgrounds'
import getCampgrounds from '@/libs/campgrounds/getCampgrounds'

export default function Campgrounds() {
  const [isReady, setIsReady] = useState(false)
  const [campgrounds, setCampgrounds] = useState<CampgroundsJson>()

  const fetchCampground = async (
    name: string,
    province: string,
    facilities: string
  ) => {
    let queryString = ''
    if (name.trim().length != 0) {
      queryString += 'name=' + name
    }
    if (province.trim().length != 0) {
      queryString += 'province=' + province
    }
    if (facilities.trim().length != 0) {
      queryString += 'facilities=' + facilities
    }

    const campgroundList = await getCampgrounds(queryString)
    setCampgrounds(campgroundList)
  }

  useEffect(() => {
    fetchCampground('', '', '')
    setIsReady(true)
  }, [])

  if (!isReady || !campgrounds) return <SuspenseUI />

  const handleSearchQuery = (
    selectedName: string,
    selectedProvince: string,
    selectedFacilities: CampgroundFacilityItem
  ) => {
    const facilitiesList: (keyof CampgroundFacilityItem)[] = [
      'tent',
      'toilet',
      'electricity',
      'wifi',
      'parking',
      'breakfast',
      'store',
    ]

    const facilitiesArray: string[] = []
    for (let facility of facilitiesList) {
      if (selectedFacilities[facility]) {
        facilitiesArray.push(facility)
      }
    }

    let selectedFacilitiesStr = facilitiesArray.join(',')
    fetchCampground(selectedName, selectedProvince, selectedFacilitiesStr)
  }

  return (
    <main className='px-12 pt-9'>
      <div className='flex justify-between items-center mb-6'>
        <div className='text-4xl font-bold z-30 text-cgr-black align-middle'>
          Campgrounds
        </div>
        <SearchBar handleChange={handleSearchQuery} />
      </div>
      <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
      {campgrounds.count > 0 ? (
        <CampgroundPanelCampgrounds campgrounds={campgrounds.data} />
      ) : (
        <p className='text-2xl font-semibold text-center'>
          No campground match your conditions
        </p>
      )}
    </main>
  )
}
