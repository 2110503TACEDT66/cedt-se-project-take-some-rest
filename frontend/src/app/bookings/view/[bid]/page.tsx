'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import CampgroundCardBooking from '@/components/basic/card/CampgroundCardBooking'
import Card from '@/components/basic/card/Card'
import deleteReserve from '@/libs/bookings/deleteReserve'
import getReserve from '@/libs/bookings/getReserve'
import getCampground from '@/libs/campgrounds/getCampground'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BookingView({ params }: { params: { bid: string } }) {
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const router = useRouter()

  const [booking, setBooking] = useState<MyReservesItem | null>(null)
  const [campground, setCampground] = useState<CampgroundItem | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const booking = (await getReserve(session.user?.token, params.bid)).data
      const campground = (await getCampground(booking.campground._id)).data
      setBooking(booking)
      setCampground(campground)

      console.log(booking)
      console.log(campground)
    }
    fetchData()
    setIsReady(true)
  }, [])

  if (!isReady || !campground || !booking) return <SuspenseUI />

  const bookedDate = new Date(booking.startDate)
  const reserveDate = new Date(booking.reservedAt)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return (
    <main className='bg-white px-1 py-10 sm:px-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen'>
      <Card>
        <div className='flex flex-col p-12'>
          {/* header */}
          <div className='flex flex-row justify-between mb-4'>
            <h1 className='text-2xl font-bold text-cgr-dark-green'>
              Booking Date :{' '}
              {bookedDate.getDate() +
                ' ' +
                monthNames[bookedDate.getMonth()] +
                ', ' +
                bookedDate.getFullYear()}
            </h1>
            <div className='flex flex-row gap-x-4'>
              <Link href={`/bookings/edit?rid=${booking._id}`}>
                <button className='cgr-btn-outline'>Edit</button>
              </Link>

              <button
                className='cgr-btn-red'
                onClick={async () => {
                  if (confirm('Please confirm to delete this reserve')) {
                    await deleteReserve(session.user?.token, booking._id)
                    router.push('/bookings')
                  }
                }}>
                Delete
              </button>
            </div>
          </div>
          <div className='grid grid-cols-2 mb-10 gap-7'>
            <div className='flex flex-col'>
              <CampgroundCardBooking campground={campground} />
              <p className='text-lg mb-2'>
                <strong>Site Number</strong> : {booking.site.number}
              </p>
              <p className='text-lg mb-2'>
                <strong>Zone</strong> : {booking.site.zone}
              </p>
              <p className='text-lg'>
                <strong>Site Size</strong> :{' '}
                {booking.site.size.slength + ' * ' + booking.site.size.swidth}
              </p>
            </div>
            {campground.pictureString ? (
              <Image
                src={`data:image/png;base64,${campground.pictureString}`}
                alt={'Campground pic'}
                width={400}
                height={200}
                className='object-cover rounded-xl w-full h-full'
              />
            ) : (
              <div className='rounded-xl shadow-none bg-cgr-gray-10 w-full h-full flex items-center justify-center'>
                <div>
                  <i className='bi bi-image h-full text-3xl'></i>
                </div>
              </div>
            )}
          </div>
          <div className='flex justify-center'>
            <hr className='w-full' />
          </div>
          <div className='flex flex-col gap-y-3 mt-5'>
            <p className='text-lg'>
              <strong className='font-semibold'>Preferred Name</strong> :{' '}
              {booking.preferredName}
            </p>
            <p className='text-lg'>
              <strong className='font-semibold'>Tent size</strong> :{' '}
              {booking.tentSize.slength + ' * ' + booking.tentSize.swidth}
            </p>
            <p className='text-lg'>
              <strong className='font-semibold'>Amount</strong> :{' '}
              {booking.amount}
            </p>
            <p className='text-lg'>
              <strong className='font-semibold'>Reserved At</strong> :{' '}
              {reserveDate.getDate() +
                ' ' +
                monthNames[reserveDate.getMonth()] +
                ', ' +
                reserveDate.getFullYear()}
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
