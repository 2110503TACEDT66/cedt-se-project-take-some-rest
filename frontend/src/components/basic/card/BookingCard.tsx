import Image from 'next/image'
import Link from 'next/link'

import Card from '@/components/basic/card/Card'
import { getMonthName } from '@/utils/dateUtils'

export default async function Component({
  campground,
  site,
  date,
  id,
}: {
  campground: CampgroundItem
  site: CampgroundSiteItem
  date: Date
  id: string
}) {
  const newDate = new Date(date)

  return (
    <Link
      href={`/bookings/view/${id}`}
      className='hover:scale-105 duration-300'>
      <Card>
        <div className='p-0 flex flex-row'>
          {campground.pictureString ? (
            <Image
              src={`data:image/png;base64,${campground.pictureString}`}
              alt={`${campground.name} picture`}
              width={0}
              height={0}
              sizes='100vw'
              className='object-cover w-1/4 rounded-l-xl shadow-none'></Image>
          ) : (
            <div className='w-1/4 rounded-l-xl shadow-none bg-cgr-light-green'></div>
          )}
          <div className='w-3/4 p-6'>
            {/* Card Title */}
            <div className='mb-4'>
              <p className='text-2xl font-bold text-cgr-black'>
                {campground.name}
              </p>
              <p className='text-md font-light'>
                {campground.address.province}
              </p>
            </div>

            {/* Card Detail */}
            <div className='my-4 flex flex-col space-y-1 text-sm'>
              <div className='flex flex-row'>
                <i className='bi bi-signpost-split w-fill me-3'></i>
                <div className=''>
                  <p>Site number : {site.number}</p>
                  <p>Zone : {site.zone}</p>
                </div>
              </div>
              <div className='flex flex-row'>
                <i className='bi bi-telephone w-fill me-3'></i>
                <p className=''>Tel : {campground.tel}</p>
              </div>
            </div>

            {/* Booking Date */}
            <div className='mt-3 text-cgr-dark-green font-bold text-md'>
              Booking date : {newDate.getDate()}{' '}
              {getMonthName(newDate.getMonth())} {newDate.getFullYear()}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
