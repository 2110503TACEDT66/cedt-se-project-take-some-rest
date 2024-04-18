import BookingPanel from '@/components/complex/BookingPanel'
import getReserves from '@/libs/bookings/getReserves'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Link from 'next/link'

export default async function Bookings() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user.token) return null

  const queryString1: string =
    'sort=startDate&startDate[gte]=' +
    new Date(Date.now()).getFullYear() +
    '-' +
    (new Date(Date.now()).getMonth() + 1) +
    '-' +
    new Date(Date.now()).getDate()
  const queryString2: string =
    'sort=startDate&startDate[lt]=' +
    new Date(Date.now()).getFullYear() +
    '-' +
    (new Date(Date.now()).getMonth() + 1) +
    '-' +
    new Date(Date.now()).getDate()

  const incomingBooking: BookedReservesItem[] = (
    await getReserves(session.user?.token, queryString1)
  ).data
  const achievedBooking: BookedReservesItem[] = (
    await getReserves(session.user?.token, queryString2)
  ).data

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>
      <div className='flex flex-row flex-wrap justify-between items-baseline space-y-2 mb-8'>
        <div></div>
        <Link href='/bookings/create'>
          <button className='cgr-btn w-full md:w-fit'>Book more</button>
        </Link>
      </div>
      {incomingBooking.length != 0 ? (
        <div className='mb-24'>
          <p className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
            Incoming Booking
          </p>
          <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
          <BookingPanel bookings={incomingBooking} />
        </div>
      ) : (
        <div className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
          No Incoming Booking
          <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
        </div>
      )}
      {achievedBooking.length != 0 ? (
        <div>
          <p className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
            Achieved Booking
          </p>
          <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
          <BookingPanel bookings={achievedBooking} />
        </div>
      ) : (
        <div className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
          No Achieved Booking
          <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
        </div>
      )}
    </main>
  )
}
