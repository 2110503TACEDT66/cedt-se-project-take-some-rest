import Link from 'next/link'

export default function CampgroundCardBooking({
  campground,
}: {
  campground: CampgroundItem
}) {
  const googleMapString = campground.address.link
    .split('/')
    .slice(0, 3)
    .join('/')
  const websiteString = campground.website.split('/').slice(0, 3).join('/')

  return (
    <Link
      href={`/campgrounds/view/${campground._id}`}
      className='border-[3px] border-cgr-light-green px-8 py-5 rounded-2xl mb-4 w-full relative'>
      <div className='flex flex-col'>
        <h1 className='text-xl font-semibold'>{campground.name}</h1>
        <h2 className='text-md'>{campground.address.province}</h2>
      </div>
      <div className='flex flex-col mt-4'>
        <div>
          <i className='bi bi-map mr-2'></i> Map : {googleMapString}
        </div>
        <div>
          <i className='bi bi-compass mr-2'></i> Website : {websiteString}
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
