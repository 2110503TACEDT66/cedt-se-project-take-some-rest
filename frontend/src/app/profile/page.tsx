'use client'
import Link from 'next/link'
import Card from '@/components/basic/card/Card'
import getMe from '@/libs/users/getMe'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function ViewProfile() {

  const {data: session} = useSession();
  if (!session || !session.user.token) return null
  const [user, setUser] = useState<UserItem>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData: UserItem = (await getMe(session.user.token)).data
      setUser(userData);
    };

    fetchUser();
  }, [])

  if (!user) return null;

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
          <div className='flex flex-row mb-3'>
            <p className='font-normal text-sm content-center'>Request to be an campground owner :</p>
            <button className='border-solid border-2 border-cgr-dark-green text-cgr-dark-green
            hover:bg-cgr-dark-green hover:text-white transition duration-200
            h-8 w-18 ml-2 px-2 rounded-lg text-sm text-center'
            onClick={()=>window.confirm('Are you confirm to request to be an campground owner?')}>Request</button>
          </div>
          <div className='flex flex-row gap-3 justify-end'>
            <Link href='/profile/edit' className='flex justify-end'>
              <button className='cgr-btn-outline'>Edit</button>
            </Link>
            <Link href='/logout' className='flex justify-end'>
              <button className='cgr-btn-red'>Logout</button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  )
}
