import Link from 'next/link'
import { getServerSession } from 'next-auth'

import { authOptions } from '../api/auth/[...nextauth]/route'
import Card from '@/components/basic/card/Card'
import getMe from '@/libs/users/getMe'

export default async function ViewProfile() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user.token) return null

  const user = (await getMe(session.user.token)).data

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
