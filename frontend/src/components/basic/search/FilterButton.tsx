'use client'

import getProvinces from '@/libs/thaidatas/getProvinces'
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'

export default function FilterButton({
  handleChange,
}: {
  handleChange: Function
}) {
  interface optionType {
    id: number
    name: string
  }

  const [isDropdown, setIsDropdown] = useState(false)
  const [provincesList, setProvincesList] = useState<optionType[]>([])
  const [province, setProvince] = useState<optionType | null>(null)

  const [selectAll, setSelectAll] = useState(false)
  const [facilities, setFacilities] = useState<CampgroundFacilityItem>({
    tent: false,
    toilet: false,
    electricity: false,
    wifi: false,
    parking: false,
    breakfast: false,
    store: false,
  })

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
  }, [])

  useEffect(() => {
    checkSelectAll()
  }, [facilities])

  useEffect(() => {
    if (province) {
      handleChange(province.name, facilities)
    } else {
      handleChange('', facilities)
    }
  }, [province, facilities])

  const handleChangeFacilities = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFacilities({
      ...facilities,
      [event.target.name]: event.target.checked,
    })
  }

  const handleChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(!selectAll)
    setFacilities({
      tent: !selectAll,
      toilet: !selectAll,
      electricity: !selectAll,
      wifi: !selectAll,
      parking: !selectAll,
      breakfast: !selectAll,
      store: !selectAll,
    })
  }

  const checkSelectAll = () => {
    let facilitiesCheck = Object.values(facilities)
    let status = true
    facilitiesCheck.forEach((element) => {
      if (!element) {
        setSelectAll(false)
        status = false
        return
      }
    })
    if (status) {
      setSelectAll(true)
    }
  }

  return (
    <div className='m-0 p-0 z-[90]'>
      <button
        className='bg-white px-2 rounded-lg border-2 border-cgr-dark-green text-cgr-dark-green h-full'
        onClick={() => setIsDropdown(!isDropdown)}>
        <i className='bi bi-filter text-3xl'></i>
      </button>
      {isDropdown ? (
        <div className='absolute bg-white shadow-md py-5 px-10 rounded-lg right-5 mt-3 w-96'>
          <div className='flex flex-row gap-x-5'>
            <div className='self-center h-full w-fill font-medium'>
              Province
            </div>
            <div className='w-full'>
              <Autocomplete
                disablePortal
                id='province'
                options={provincesList}
                getOptionLabel={(option: optionType) => `${option.name}`}
                size='small'
                value={province}
                onChange={(event, newValue, reason) => {
                  if (reason === 'clear') {
                    setProvince({ name: '', id: 0 })
                    return
                  } else if (newValue) {
                    setProvince({ name: newValue.name, id: newValue.id })
                  }
                }}
                renderInput={(params) => (
                  <TextField required {...params} label='Province' />
                )}
              />
            </div>
          </div>
          <br />
          <div className='flex flex-wrap gap-x-2'>
            <div className='flex flex-row w-full gap-x-10 mb-3'>
              <p className='self-center font-medium'>Facilities</p>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: '#339989',
                      '&.Mui-checked': { color: '#339989' },
                    }}
                    checked={selectAll}
                    onChange={handleChangeAll}
                    name='Select All'
                  />
                }
                label='Select All'
              />
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.tent}
                  onChange={handleChangeFacilities}
                  name='tent'
                />
              }
              label='Tent'
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.toilet}
                  onChange={handleChangeFacilities}
                  name='toilet'
                />
              }
              label='Toilet & Shower'
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.electricity}
                  onChange={handleChangeFacilities}
                  name='electricity'
                />
              }
              label='Electricity'
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.wifi}
                  onChange={handleChangeFacilities}
                  name='wifi'
                />
              }
              label='Wifi'
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.parking}
                  onChange={handleChangeFacilities}
                  name='parking'
                />
              }
              label='Parking'
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.breakfast}
                  onChange={handleChangeFacilities}
                  name='breakfast'
                />
              }
              label='Breakfast'
            />{' '}
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: '#339989',
                    '&.Mui-checked': { color: '#339989' },
                  }}
                  checked={facilities.store}
                  onChange={handleChangeFacilities}
                  name='store'
                />
              }
              label='Convenience store'
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
