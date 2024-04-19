'use client'

import { useState } from 'react'
import { TextField } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Card from '@/components/basic/card/Card'
import register from '@/libs/users/register'

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = () => {
    if (name && tel && email && password) {
      const callRegister = async () => {
        await register(name, tel, email, password)
      }
      callRegister()
      router.push('/login')
    } else {
      alert('Please provide all required information')
    }
  }

  return (
    <main className='bg-white px-2 py-10 sm:px-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen'>
      <Card>
        <div className='py-8'>
          <h1 className='text-4xl font-bold text-cgr-dark-green flex justify-center'>
            Register
          </h1>
          <p className='flex justify-center mt-2'>
            Join us and enjoy camping experience together!
          </p>
        </div>
        <div className='px-12 py-2'>
          <div className='flex flex-col items-center text-lg gap-5 mb-3'>
            <TextField
              required
              id='name'
              label='Your name'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2 w-[80%] mb-2'
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value)
              }}></TextField>
            <TextField
              required
              id='tel'
              label='Telephone number'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2 w-[80%] mb-2'
              value={tel}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTel(event.target.value)
              }}></TextField>
            <TextField
              required
              id='email'
              label='Email'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2 w-[80%] mb-2'
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value)
              }}></TextField>
            <TextField
              type='password'
              id='password'
              label='Password'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='md:col-span-2 w-[80%] mb-2'
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
            />
            <button className='cgr-btn w-[80%]' onClick={submit}>
              Register
            </button>
          </div>
          <div className='flex flex-row mb-6 ml-8'>
            <p className='text-sm ml-12 mt-2 mb-6'>
              Already have an account ?
              <Link
                href='/login'
                className='text-sm ml-4 mt-2 text-cgr-dark-green'>
                Login
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
