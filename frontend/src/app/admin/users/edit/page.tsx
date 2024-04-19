'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

import Card from '@/components/basic/card/Card'
import SuspenseUI from '@/components/basic/SuspenseUI'
import getUser from '@/libs/users/getUser'
import updateUser from '@/libs/users/updateUser'
import updateUserRole from '@/libs/users/updateUserRole'
import deleteUser from '@/libs/users/deleteUser'

export default function EditUser() {
  const router = useRouter()
  const { data: session } = useSession()
  if (!session || !session.user.token || session.user.role !== 'admin') {
    router.replace('/')
    return null
  }

  const urlParams = useSearchParams()
  const paramsUid = urlParams.get('uid')
  if (!paramsUid) return <h1>Please provide user id</h1>

  const [isReady, setIsReady] = useState(false)
  const [name, setName] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  // const [password, setPassword] = useState('')

  const submit = async () => {
    if (name && tel && email && role) {
      if (paramsUid) {
        await updateUser(session.user.token, paramsUid, name, tel, email)
        await updateUserRole(session.user.token, paramsUid, role)
      }
      router.back()
    } else {
      alert('Please provide all required information')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (paramsUid) {
        const user = (await getUser(session.user.token, paramsUid)).data
        setName(user.name)
        setTel(user.tel)
        setEmail(user.email)
        setRole(user.role)
      }
    }
    fetchData()
    setIsReady(true)
  }, [])

  if (!isReady) return <SuspenseUI />

  return (
    <main className='bg-white px-4 py-10 sm:px-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen'>
      <h1 className='text-4xl font-bold text-cgr-dark-green mb-8'>
        Edit User's Profile
      </h1>
      <Card>
        <div className='px-12 py-10'>
          <div className='grid grid-cols-1 md:grid-cols-3 text-lg gap-5 mb-3'>
            <p className='font-medium'>Name : </p>
            <TextField
              required
              id='name'
              label='Name'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2'
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value)
              }}
            />
            <p className='font-medium'>Telephone number : </p>
            <TextField
              required
              id='tel'
              label='Telephone number'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2'
              value={tel}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTel(event.target.value)
              }}
            />
            <p className='font-medium'>Email : </p>
            <TextField
              required
              id='email'
              label='Email'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2'
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value)
              }}
            />
            <p className='font-medium'>Role : </p>
            <Select
              labelId='Role'
              id='role'
              value={role}
              size='small'
              onChange={(event: SelectChangeEvent) => {
                setRole(event.target.value)
              }}
              className='md:col-span-2'>
              <MenuItem value={'admin'}>Admin</MenuItem>
              <MenuItem value={'customer'}>Customer</MenuItem>
            </Select>
          </div>
          <div className='flex justify-center mt-6'>
            <button className='cgr-btn w-full' onClick={submit}>
              Done
            </button>
          </div>
        </div>
      </Card>
      <div className='flex justify-end mt-10'>
        <button
          className='cgr-btn-red'
          onClick={async () => {
            if (confirm('Are you sure to delete this account?')) {
              await deleteUser(session.user.token, paramsUid)
              router.push('/admin/users')
            }
          }}>
          Delete account
        </button>
      </div>
    </main>
  )
}
