import Image from 'next/image'
import Link from 'next/link'

import Card from '@/components/basic/card/Card'
import Tag from '@/components/basic/Tag'

export default function CampgroundCardCampgrounds({
  campground,
}: {
  campground: CampgroundItem
}) {
  return (
    <Link
      href={`/campgrounds/view/${campground._id}`}
      className='hover:scale-105 duration-300'>
      <Card>
        <div className='p-0 flex flex-row'>
          {campground.pictures.length != 0 ? (
            <Image
              src={`${process.env.BACKEND_URL}/images/${campground.pictures[0]}`}
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
                <p>Site number : {campground.amount}</p>
              </div>
              <div className='flex flex-row'>
                <i className='bi bi-telephone w-fill me-3'></i>
                <p className=''>Tel : {campground.tel}</p>
              </div>
            </div>

            {/* Facility */}
            <div className='flex flex-row space-x-2 overflow-auto'>
              {campground.facilities.map((data) => (
                <Tag size='xs'>{data}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
