'use client'

import { useState } from 'react'
import NavbarItem from './NavbarItem'

export default function NavbarDropdownItem() {
  const [isDropdown, setIsDropdown] = useState(false)

  const handleHover = () => setIsDropdown(!isDropdown)

  return (
    <button className='text-md font-normal text-black mx-5 duration-200 text-left'>
      <div onClick={handleHover} className='hover:text-cgr-black'>
        <i className='bi bi-bar-chart-fill mr-2'></i>Dashboard
      </div>
      {isDropdown ? (
        <div
          className='absolute bg-cgr-white py-5 px-7 rounded-lg shadow-lg mt-6 flex flex-col gap-y-4'
          onClick={handleHover}>
          <NavbarItem path='/admin/campgrounds'>Campgrounds</NavbarItem>
          <NavbarItem path='/admin/bookings'>Bookings</NavbarItem>
          <NavbarItem path='/admin/users'>Users</NavbarItem>
          <NavbarItem path='/admin/reviews'>Reviews</NavbarItem>
          <NavbarItem path='/admin/logs'>Logs</NavbarItem>
        </div>
      ) : (
        ''
      )}
    </button>
  )
}
