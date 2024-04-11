'use client'

import { useState } from 'react'

import FilterButton from './FilterButton'

export default function SearchBar({
  handleChange,
}: {
  handleChange: Function
}) {
  const [name, setName] = useState('')
  const [facilities, setFacilities] = useState<CampgroundFacilityItem>({
    tent: false,
    toilet: false,
    electricity: false,
    wifi: false,
    parking: false,
    breakfast: false,
    store: false,
  })
  const [province, setProvince] = useState('')

  return (
    <div className='w-fill flex flex-row gap-x-4'>
      <input
        type='text'
        className='cgr-search-box placeholder-cgr-dark-green w-full'
        placeholder='Find something...'
        value={name}
        onChange={(element) => {
          setName(element.target.value)
        }}
      />
      <FilterButton
        handleChange={(
          selectedProvince: string,
          selectedFacilities: CampgroundFacilityItem
        ) => {
          setProvince(selectedProvince)
          setFacilities(selectedFacilities)
        }}
      />
      <button
        className='bg-cgr-dark-green px-3 rounded-lg text-white m-0 p-0'
        onClick={() => {
          handleChange(name, province, facilities)
        }}>
        <i className='bi bi-search text-2xl'></i>
      </button>
    </div>
  )
}
