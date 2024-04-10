'use client'

import getProvinces from '@/libs/thaidatas/getProvinces'
import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

export default function FilterButton() {
  interface optionType {
    id: number
    name: string
  }

  const [isDropdown, setIsDropdown] = useState(false)
  const [provincesList, setProvincesList] = useState<optionType[]>([])
  const [province, setProvince] = useState<optionType | null>(null)

  // Function for fetch provinces, district, sub-district
  const fetchProvinces = async () => {
    const provinces = await getProvinces()
    const provinceList: optionType[] = provinces.map((element: any) => ({
      id: element.id,
      name: element.name_en,
    }))
    setProvincesList(provinceList)
  }

  useEffect(() => {
    fetchProvinces()
  })

  return (
    <div className='m-0 p-0 z-[100]'>
      <button
        className='bg-white px-2 rounded-lg border-2 border-cgr-dark-green text-cgr-dark-green h-full'
        onClick={() => setIsDropdown(!isDropdown)}>
        <i className='bi bi-filter text-3xl'></i>
      </button>
      {isDropdown ? (
        <div className='absolute bg-white shadow-md p-5 rounded-lg right-5 mt-3 w-fill'>
          <div className='flex flex-row gap-x-5'>
            <div className='align-middle h-full'>Province :</div>
            <div className=''>
              <Autocomplete
                disablePortal
                id='province'
                options={provincesList}
                getOptionLabel={(option: optionType) => `${option.name}`}
                size='small'
                onChange={(event, newValue) => {
                  if (newValue) {
                    setProvince({ name: newValue.name, id: newValue.id })
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label='Province'
                    value={province?.name}
                  />
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
