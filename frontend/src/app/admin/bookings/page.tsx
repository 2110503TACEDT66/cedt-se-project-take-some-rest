'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import getReserves from '@/libs/bookings/getReserves'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NoPermissionUI from '@/components/basic/NoPermissionUI'

export default function BookingsTable() {
  const { data: session } = useSession()
  if (
    !session ||
    !session.user.token ||
    (session.user.role !== 'admin' && session.user.role !== 'campgroundOwner')
  )
    return <NoPermissionUI />

  const [booking, setBooking] = useState<MyReservesItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const [query, setQuery] = useState('')

  const fetchData = async () => {
    setIsReady(false)
    var queryString = query.length != 0 ? `preferredName=${query}` : ''
    const bookingFromFetch: MyReservesItem[] = (
      await getReserves(session.user.token, queryString)
    ).data
    setBooking(bookingFromFetch)
    setIsReady(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>
      <h1 className='text-cgr-black text-4xl font-bold mb-4'>Booking</h1>
      <div className='flex flex-row flex-wrap justify-between items-baseline space-y-2 mb-8'>
        <div className='flex flex-row w-full md:w-fit space-x-3'>
          <input
            type='text'
            className='cgr-search-box placeholder-cgr-dark-green w-full'
            placeholder='Find something...'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
          />
          <button
            className='cgr-btn'
            onClick={() => {
              fetchData()
            }}>
            Search
          </button>
        </div>
      </div>
      <table className='cgr-table'>
        <tr className='h-10'>
          <th className='w-2/6'>User</th>
          <th className='w-1/6'>Date</th>
          <th className='w-1/6'>Campground Name</th>
          <th className='w-1/6'>Zone</th>
          <th className='w-1/6'>Site Number</th>
          <th className='w-1/6'>View</th>
        </tr>
        {isReady ? (
          booking.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.preferredName}</td>
              <td>{obj.startDate.toString()}</td>
              <td>{obj.campground.name}</td>
              <td className='text-center'>{obj.site.zone}</td>
              <td className='text-center'>{obj.site.number}</td>
              <td className='text-center'>
                <Link href={`/bookings/view/${obj._id}`}>
                  <button className='cgr-btn-outline-gray'>View</button>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>
              <SuspenseUI />
            </td>
          </tr>
        )}
      </table>
    </main>
  )
}
