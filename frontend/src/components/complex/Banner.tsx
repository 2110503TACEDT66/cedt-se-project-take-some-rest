import Image from 'next/image'
import Link from 'next/link'

export default function Banner() {
  return (
    <div className='m-0 p-0 mt-10 h-[65vh] relative'>
      <div className='z-[-1]'>
        <Image
          src={'/img/BannerImage.jpg'}
          alt='banner image'
          fill={true}
          objectFit='cover'
          priority
        />
      </div>
      <div className='z-[1] text-white relative text-center sm:text-left sm:ml-24 top-[20%]'>
        <h1 className='text-5xl sm:text-7xl font-semibold my-3'>Booking</h1>
        <h1 className='text-5xl sm:text-7xl font-semibold my-3'>Campground</h1>
        <h1 className='text-lg sm:text-2xl font-medium my-10 mx-10 sm:mx-0'>
          Book the place where you like and explore the nature now
        </h1>
      </div>
      <div className='z-[1] text-white absolute bottom-10 right-10'>
        <Link href='/bookings/create'>
          <button className='cgr-btn-outline-white'>
            Book Now <i className='bi bi-arrow-right-circle-fill ml-3'></i>
          </button>
        </Link>
      </div>
    </div>
  )
}
