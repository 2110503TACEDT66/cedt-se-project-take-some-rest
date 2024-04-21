'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import getMyCampgrounds from '@/libs/campgrounds/getCampgrounds'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NoPermissionUI from '@/components/basic/NoPermissionUI'

export default function CampgroundsTable() {
  const { data: session } = useSession()
  if (
    !session ||
    !session.user.token ||
    (session.user.role !== 'admin' && session.user.role !== 'campgroundOwner')
  )
    return <NoPermissionUI />

  const [campground, setCampground] = useState<CampgroundItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const [query, setQuery] = useState('')

  const fetchData = async () => {
    setIsReady(false)
    var queryString = query.length != 0 ? `name=${query}` : ''
    const campgroundFromFetch: CampgroundItem[] = (
      await getMyCampgrounds(queryString)
    ).data
    setCampground(campgroundFromFetch)
    setIsReady(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>
      <h1 className='text-cgr-black text-4xl font-bold mb-4'>Campgrounds</h1>
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
        <Link href='/admin/campgrounds/create' className='w-full md:w-fit'>
          <button className='cgr-btn w-full md:w-fit'>Create Campground</button>
        </Link>
      </div>
      <table className='cgr-table'>
        <tr className='h-10'>
          <th className='w-2/6'>Campground name</th>
          <th className='w-1/6'>Province</th>
          <th className='w-1/6'>Telephone</th>
          <th className='w-1/6'>Site amount</th>
          <th className='w-1/6'>View</th>
        </tr>
        {isReady ? (
          campground.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.name}</td>
              <td>{obj.address.province}</td>
              <td>{obj.tel}</td>
              <td className='text-center'>{obj.amount}</td>
              <td className='text-center'>
                <Link href={`/admin/campgrounds/view/${obj._id}`}>
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
