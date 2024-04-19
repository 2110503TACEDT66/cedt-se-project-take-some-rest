import Link from 'next/link'
import Card from './Card'
import Image from 'next/image'
import Tag from '../Tag'

export default function CampgroundCardHome({
  campground,
}: {
  campground: CampgroundItem
}) {
  return (
    <Link
      href={`/campgrounds/view/${campground._id}`}
      className='hover:scale-105 duration-300'
      data-testid='card'>
      <Card>
        <div className='flex flex-col'>
          {campground.pictureString ? (
            <Image
              src={`data:image/png;base64,${campground.pictureString}`}
              alt={`${campground.name} picture`}
              width={0}
              height={0}
              sizes='100vw'
              className='object-cover w-full h-[300px] rounded-t-xl shadow-none'></Image>
          ) : (
            <div className='w-full h-[300px] rounded-t-xl shadow-none bg-cgr-light-green'></div>
          )}
          <div className='px-6 pt-4 pb-6'>
            {/* title */}
            <p className='text-2xl font-semibold text-cgr-black'>
              {campground.name}
            </p>
            <p className='text-md font-light'>{campground.address.province}</p>
            {/* total site */}
            <div className='flex flex-row text-sm mt-3'>
              <i className='bi bi-signpost-split w-fill me-3'></i>
              <p>Site available : {campground.amount}</p>
            </div>
            {/* tel */}
            <div className='flex flex-row text-sm'>
              <i className='bi bi-telephone w-fill me-3'></i>
              <p className=''>Tel : {campground.tel}</p>
            </div>
            {/* facilities */}
            <div className='flex flex-row gap-2 mt-4' data-testid='tags'>
              {campground.facilities.map((data) => (
                <Tag size='sm' key={data}>
                  {data}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
