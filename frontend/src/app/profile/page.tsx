'use client'
import Link from 'next/link'
import Card from '@/components/basic/card/Card'
import getMe from '@/libs/users/getMe'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import NoPermissionUI from '@/components/basic/NoPermissionUI'
import updateUserRequest from '@/libs/users/userRequestToBeCampgroundOwner'

export default function ViewProfile() {
  const { data: session } = useSession()
  if (!session || !session.user.token) return <NoPermissionUI />
  const [user, setUser] = useState<UserItem | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData: UserItem = (await getMe(session.user.token)).data
      setUser(userData)
    }

    fetchUser()
  }, [])

  if (!user) return null

  return (
    <main className='bg-white p-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen'>
      <h1 className='text-4xl font-bold text-cgr-dark-green mb-8'>
        Your Profile
      </h1>
      <Card>
        <div className='px-10 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 text-lg gap-3 mb-3'>
            <p className='font-medium'>Name : </p>
            <p className='md:col-span-2'>{user.name}</p>
            <p className='font-medium'>Telephone number : </p>
            <p className='md:col-span-2'>{user.tel}</p>
            <p className='font-medium'>Email : </p>
            <p className='md:col-span-2'>{user.email}</p>
          </div>
          <div className='flex flex-row-reverse justify-between'>
            <div className='flex space-x-3 items-stretch'>
              <Link href='/profile/edit'>
                <button className='cgr-btn-outline'>Edit</button>
              </Link>
              <Link href='/logout'>
                <button className='cgr-btn-red !h-full'>Logout</button>
              </Link>
            </div>
            {user.role === 'customer' &&
            user.requestToBeCampgroundOwner === false ? (
              <div className='flex space-x-3 items-center'>
                <p className='font-normal text-sm'>
                  Request to be an campground owner :
                </p>
                <button
                  className='cgr-btn-outline text-sm !px-5 !py-1'
                  onClick={async () => {
                    if (
                      confirm('Are you sure to request to be campground owner?')
                    ) {
                      await updateUserRequest(session.user.token)
                      window.location.reload()
                    }
                  }}>
                  Request
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </Card>
    </main>
  )
}
