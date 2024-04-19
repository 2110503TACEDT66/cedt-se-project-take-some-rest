'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import getUsers from '@/libs/users/getUsers'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import getUserRequests from '@/libs/users/getUserRequests'
import rejectRequest from '@/libs/users/rejectRequest'
import updateUserRole from '@/libs/users/updateUserRole'

export default function UsersTable() {
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const [user, setUser] = useState<UserItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const [query, setQuery] = useState('')
  const [userRequests, setUserRequests] = useState<UserItem[]>([])

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

  if (!isReady) return <SuspenseUI />

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
      {userRequests.length > 0 ? (
        <div>
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
            {userRequests.map((obj) => (
              <tr key={obj._id}>
                <td>{obj.name}</td>
                <td>{obj.email}</td>
                <td>{obj.tel}</td>
                <td className='text-center'>
                  <button
                    className='cgr-btn'
                    onClick={async () => {
                      if (
                        confirm(
                          `Are you sure you want to approve this user's request ?`
                        )
                      ) {
                        await updateUserRole(
                          session.user.token,
                          obj._id,
                          'campgroundOwner'
                        )
                        window.location.reload()
                      }
                    }}>
                    Accept
                  </button>
                </td>
                <td className='text-center'>
                  <button
                    className='cgr-btn-red'
                    onClick={async () => {
                      if (
                        confirm(
                          `Are you sure you want to reject this user's request ?`
                        )
                      ) {
                        await rejectRequest(session.user.token, obj._id)
                        window.location.reload()
                      }
                    }}>
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        ''
      )}

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
        {user.map((obj) => (
          <tr key={obj._id}>
            <td>{obj.name}</td>
            <td>{obj.email}</td>
            <td>{obj.tel}</td>
            <td className='text-center'>
              {obj.role.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </td>
            <td className='text-center'>
              <Link href={`/admin/users/view/${obj._id}`}>
                <button className='cgr-btn-outline-gray'>View</button>
              </Link>
            </td>
          </tr>
        ))}
      </table>
    </main>
  )
}
