'use client'

import Link from 'next/link'

import Card from '@/components/basic/card/Card'
import { useSession } from 'next-auth/react'
import getUser from '@/libs/users/getUser'
import deleteUser from '@/libs/users/deleteUser'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SuspenseUI from '@/components/basic/SuspenseUI'

export default function AdminViewUser({ params }: { params: { uid: string } }) {
  const router = useRouter()

  const { data: session } = useSession()
  if (!session || !session.user.token || session.user.role !== 'admin') {
    router.replace('/')
    return null
  }

  const [user, setUser] = useState<UserItem | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setUser((await getUser(session.user?.token, params.uid)).data)
    }
    fetchData()
  }, [])

  if (!user) return <SuspenseUI />

  return (
    <main className='bg-white p-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen'>
      <h1 className='text-4xl font-bold text-cgr-dark-green mb-8'>
        User's information
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
            <p className='font-medium'>Role : </p>
            <p className='md:col-span-2'>{user.role}</p>
          </div>
          <div className='flex justify-end gap-4'>
            <Link href={`/admin/users/edit?uid=${params.uid}`}>
              <button className='cgr-btn-outline'>Edit</button>
            </Link>
            <button
              className='cgr-btn-red'
              onClick={async () => {
                if (confirm('Are you sure to delete this user?')) {
                  await deleteUser(session.user.token, params.uid)
                  router.back()
                }
              }}>
              Delete
            </button>
          </div>
        </div>
      </Card>
    </main>
  )
}
