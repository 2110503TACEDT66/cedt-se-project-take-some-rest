'use client'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import SuspenseUI from '@/components/basic/SuspenseUI'
import getUsers from '@/libs/users/getUsers'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import getUserRequests from '@/libs/users/getUserRequests'

export default function UsersTable() {
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const [user, setUser] = useState<UserItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const [query, setQuery] = useState('')
  const [userRequests,setUserRequests] = useState<UserItem[]>([])

  const fetchData = async () => {
    setIsReady(false)
    var queryString = query.length != 0 ? `name=${query}` : ''
    const userFromFetch: UserItem[] = (
      await getUsers(session.user?.token, queryString)
    ).data
    setUser(userFromFetch)
    setIsReady(true)
  }

  const fetchRequestData = async () => {
    setIsReady(false)
    var queryString = query.length != 0 ? `name=${query}` : ''
    const userFromFetch: UserItem[] = (
      await getUserRequests(session.user?.token, queryString)
    ).data
    setUserRequests(userFromFetch)
    setIsReady(true)
  }

  useEffect(() => {
    fetchData()
    fetchRequestData()
  }, [])

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>
      <h1 className='text-cgr-black text-4xl font-bold mb-4'>Users</h1>
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

      {/* Request */}
      <div className='text-cgr-dark-green text-2xl mb-5 font-medium'>
        Campground owner role request
      </div>
      <table className='cgr-table mb-20'>
        <tr className='h-10'>
          <th className='w-2/6'>Name</th>
          <th className='w-1/6'>Email</th>
          <th className='w-1/6'>Telephone</th>
          <th className='w-1/6'>Accept</th>
          <th className='w-1/6'>Decline</th>
        </tr>
        {isReady ? (
          // Change the user to the request user (I didn't provide)
          userRequests.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.name}</td>
              <td>{obj.email}</td>
              <td>{obj.tel}</td>
              <td className='text-center'>
                <button className='cgr-btn'>Accept</button>
                {/* implement this button to call api */}
              </td>
              <td className='text-center'>
                <button className='cgr-btn-red'>Decline</button>
                {/* implement this button to call api */}
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

      {/* Normal */}
      <div className='text-cgr-dark-green text-2xl mb-5 font-medium'>
        User information
      </div>
      <table className='cgr-table'>
        <tr className='h-10'>
          <th className='w-2/6'>Name</th>
          <th className='w-1/6'>Email</th>
          <th className='w-1/6'>Telephone</th>
          <th className='w-1/6'>Role</th>
          <th className='w-1/6'>View</th>
        </tr>
        {isReady ? (
          user.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.name}</td>
              <td>{obj.email}</td>
              <td>{obj.tel}</td>
              <td className='text-center'>{obj.role}</td>
              <td className='text-center'>
                <Link href={`/admin/users/view/${obj._id}`}>
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
