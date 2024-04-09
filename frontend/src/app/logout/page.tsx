'use client'

import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import Card from '@/components/basic/card/Card'
import logout from '@/libs/users/logout'

export default function Logout() {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session || !session.user.token) {
    router.replace('/register')
    return
  }

  return (
    <main className='bg-white px-1 py-20 sm:px-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen'>
      <Card>
        <div className='w-full h-72 relative rounded-t-xl'>
          <Image
            src={'/img/LogoutCard.jpg'}
            alt={'Login Card'}
            fill={true}
            className='object-cover rounded-t-xl'
          />
        </div>
        <div className='px-4 md:px-16 lg:px-36 xl:px-40 py-3'>
          <h1 className='text-3xl font-bold text-cgr-dark-green flex justify-center py-6'>
            Are you sure you want to logout?
          </h1>
          <div className='flex flex-row justify-center space-x-6 mt-2 mb-6'>
            <button
              className='cgr-btn w-[40%]'
              onClick={() => {
                logout(session?.user.token)
                signOut({ callbackUrl: '/' })
              }}>
              Yes
            </button>
            <button
              className='cgr-btn-outline w-[40%]'
              onClick={() => {
                router.back()
              }}>
              No
            </button>
          </div>
        </div>
      </Card>
    </main>
  )
}
