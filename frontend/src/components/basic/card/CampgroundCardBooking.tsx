'use client'

import Link from 'next/link'
import Card from './Card'
import Image from 'next/image'
import Tag from '../Tag'
import getCampground from '@/libs/campgrounds/getCampground'
import { useEffect, useState } from 'react'
import SuspenseUI from '../SuspenseUI'

export default function CampgroundCardBooking({ cgid }: { cgid: string }) {
  const [campground, setCampground] = useState<CampgroundItem>()

  useEffect(() => {
    const fetch = async () => {
      const campground: CampgroundItem = (await getCampground(cgid)).data
      setCampground(campground)
    }
    fetch()
  })

  if (!campground) return <SuspenseUI />

  const googleMapString = campground.address.link
    .split('/')
    .slice(0, 3)
    .join('/')
  const websiteString = campground.website.split('/').slice(0, 3).join('/')

  return (
    <Link
      href={`/campgrounds/view/${cgid}`}
      className='border border-[3px] border-cgr-light-green px-8 py-5 rounded-2xl mb-4 w-full relative'>
      <div className='flex flex-col'>
        <h1 className='text-xl font-semibold'>{campground.name}</h1>
        <h2 className='text-md'>{campground.address.province}</h2>
      </div>
      <div className='flex flex-col mt-4'>
        <div>
          <i className='bi bi-compass mr-2'></i> Website : {websiteString}
        </div>
        <div>
          <i className='bi bi-map mr-2'></i> Map : {googleMapString}
        </div>
        <div>
          <i className='bi bi-telephone mr-2'></i> Tel : {campground.tel}
        </div>
      </div>
      <div className='text-cgr-dark-green absolute top-5 right-5 text-2xl hover:text-4xl duration-300'>
        <i className='bi bi-arrow-right-circle-fill'></i>
      </div>
    </Link>
  )
}
