'use client'

import { useEffect, useState } from 'react'
import NavbarItem from './NavbarItem'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import NavbarDropdownItem from './NavbarDropdownItem'

export default function Navbar() {
  const { data: session } = useSession()
  const [loginTitle, setLoginTitle] = useState('Login')
  const [loginAction, setLoginAction] = useState('login')
  const [menuSpan, setMenuSpan] = useState(false)

  useEffect(() => {
    console.log(session)
    if (session) {
      setLoginTitle(session.user?.name)
      setLoginAction('profile')
    } else {
      setLoginTitle('Login')
      setLoginAction('login')
    }
  }, [session])

  return (
    <div className='fixed flex grid grid-cols-5 bg-cgr-white h-14 z-[100] top-0 right-0 left-0 w-screen items-center justify-between'>
      <div className='text-left text-cgr-dark-green font-bold text-3xl ml-7 w-fill'>
        CGR
      </div>

      {/* incase of bigger than breakpoinr md */}
      <div className='flex flex-row text-center col-span-3 hidden md:block'>
        <NavbarItem path='/'>
          <i className='bi bi-house-fill mr-2'></i>Home
        </NavbarItem>
        <NavbarItem path='/campgrounds'>
          <i className='bi bi-tree-fill mr-2'></i>Campgrounds
        </NavbarItem>
        {session ? (
          <NavbarItem path='/bookings'>
            <i className='bi bi-bookmarks-fill mr-2'></i>My Booking
          </NavbarItem>
        ) : (
          ''
        )}
        {session && session.user?.role == 'admin' ? <NavbarDropdownItem /> : ''}
      </div>
      <Link href={`/${loginAction}`} className='hidden md:block'>
        <div className='text-right text-cgr-dark-green font-bold me-8 w-fill hidden md:block'>
          {loginTitle}
        </div>
      </Link>

      {/* menu span */}
      {/* incase of smaller than breakpoinr md */}
      <div className='md:hidden col-span-4 text-right mr-7'>
        <button
          onClick={() => {
            setMenuSpan(!menuSpan)
          }}>
          Menu
          {menuSpan ? (
            <i className='bi bi-caret-up-fill ml-2'></i>
          ) : (
            <i className='bi bi-caret-down ml-2'></i>
          )}
        </button>
      </div>
      {menuSpan ? (
        <div className='md:hidden absolute mt-60 bg-cgr-gray-20 rounded-lg w-fill px-10 py-3 right-10 flex flex-col gap-y-4 shadow-xl'>
          <div
            className='flex flex-col gap-y-4'
            onClick={() => {
              setMenuSpan(!menuSpan)
            }}>
            <NavbarItem path='/'>
              <i className='bi bi-house-fill mr-2'></i>Home
            </NavbarItem>
            <NavbarItem path='/campgrounds'>
              <i className='bi bi-tree-fill mr-2'></i>Campgrounds
            </NavbarItem>
            {session ? (
              <NavbarItem path='/bookings'>
                <i className='bi bi-bookmarks-fill mr-2'></i>My Booking
              </NavbarItem>
            ) : (
              ''
            )}
            <NavbarItem path={`/${loginAction}`}>
              <i className='bi bi-person-fill mr-2'></i>
              {loginTitle}
            </NavbarItem>
          </div>

          {session && session.user?.role == 'admin' ? (
            <NavbarDropdownItem />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
