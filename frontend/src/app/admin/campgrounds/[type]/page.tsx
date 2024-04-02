'use client'

import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import getCampground from '@/libs/campgrounds/getCampground'
import createCampground from '@/libs/campgrounds/createCampground'
import updateCampground from '@/libs/campgrounds/updateCampground'
import Card from '@/components/basic/card/Card'
import SuspenseUI from '@/components/basic/SuspenseUI'
import getProvinces from '@/libs/thaidatas/getProvinces'
import getDistricts from '@/libs/thaidatas/getDistricts'
import getSubDistricts from '@/libs/thaidatas/getSubDistricts'

export default function CreateCampground({
  params,
}: {
  params: { type: string }
}) {
  const router = useRouter()

  const { data: session } = useSession()
  if (!session || !session.user.token || session.user.role !== 'admin') {
    router.replace('/')
    return null
  }

  const title = params.type === 'create' ? 'Create new' : 'Edit'
  const submitBtnTitle = params.type === 'create' ? 'Create' : 'Done'

  const urlParams = useSearchParams()
  const paramsCgid = urlParams.get('cgid')

  const [isReady, setIsReady] = useState(false)
  const [provincesList, setProvincesList] = useState([])
  const [districtsList, setDistrictsList] = useState([])
  const [subDistrictsList, setSubDistrictsList] = useState([])
  interface optionType {
    id: number
    name: string
  }

  const [name, setName] = useState('')
  const [tel, setTel] = useState('')
  const [houseNum, setHouseNum] = useState('')
  const [lane, setLane] = useState('')
  const [road, setRoad] = useState('')
  const [subdistrict, setSubdistrict] = useState<optionType | null>(null)
  const [district, setDistrict] = useState<optionType | null>(null)
  const [province, setProvince] = useState<optionType | null>(null)
  const [postalCode, setPostalCode] = useState('')
  const [googleMap, setGoogleMap] = useState('')
  const [website, setWebsite] = useState('')
  const [tentForRent, setTentForRent] = useState(false)
  const [facilities, setFacilities] = useState({
    toilet: false,
    electricity: false,
    wifi: false,
    parking: false,
    breakfast: false,
    store: false,
  })

  const [image, setImage] = useState<FormData>()

  const facilitiesList: (keyof {
    toilet: boolean
    electricity: boolean
    wifi: boolean
    parking: boolean
    breakfast: boolean
    store: boolean
  })[] = ['toilet', 'electricity', 'wifi', 'parking', 'breakfast', 'store']

  const handleChangeFacilities = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFacilities({
      ...facilities,
      [event.target.name]: event.target.checked,
    })
  }

  // For upload button
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })

  const submit = () => {
    if (
      name &&
      tel &&
      houseNum &&
      subdistrict &&
      district &&
      province &&
      postalCode
    ) {
      const address = {
        houseNumber: houseNum,
        lane,
        road,
        subDistrict: subdistrict.name,
        district: district.name,
        province: province.name,
        postalCode,
        link: googleMap,
      }

      const facilitiesArray: string[] = []
      for (let facility of facilitiesList) {
        if (facilities[facility]) {
          facilitiesArray.push(facility)
        }
      }

      const callAPI = async () => {
        if (params.type === 'create') {
          createCampground(
            session.user.token,
            name,
            tel,
            address,
            website,
            facilitiesArray,
            tentForRent
          )
        } else {
          if (!paramsCgid) return null
          updateCampground(
            session.user.token,
            paramsCgid,
            name,
            tel,
            address,
            website,
            facilitiesArray,
            tentForRent
          )
          if (image) {
            try {
              const response = await fetch(
                `${process.env.BACKEND_URL}/api/campgrounds/${paramsCgid}/upload-image`,
                {
                  method: 'POST',
                  headers: {
                    authorization: `Bearer ${session.user?.token}`,
                  },
                  body: image,
                }
              )
            } catch (error) {
              console.error('Error enhancing image:', error)
            }
          }
        }
      }
      callAPI()
      alert(
        `${title} campground successfully. Please refresh page if your data is not updated`
      )
      router.push('/admin/campgrounds')
    } else {
      alert('Please provide all required information')
    }
  }

  useEffect(() => {
    if (params.type === 'edit') {
      if (!paramsCgid) return
      const fetchData = async () => {
        const campground = (await getCampground(paramsCgid)).data
        setName(campground.name)
        setTel(campground.tel)
        setWebsite(campground.website)
        setTentForRent(campground.tentForRent)
        setHouseNum(campground.address.houseNumber)
        setLane(campground.address.lane)
        setRoad(campground.address.road)
        setSubdistrict(campground.address.subDistrict)
        setDistrict(campground.address.district)
        setProvince(campground.address.province)
        setPostalCode(campground.address.postalCode)
        for (let facility of facilitiesList) {
          if (campground.facilities.includes(facility)) {
            let newFacilities = facilities
            newFacilities[facility] = true
            setFacilities(newFacilities)
          }
        }
      }
      fetchData()
    }

    const fetchProvinces = async () => {
      const provinces = await getProvinces()
      setProvincesList(
        provinces.map((element: any) => ({
          id: element.id,
          name: element.name_en,
        }))
      )
    }
    fetchProvinces()

    setIsReady(true)
  }, [])

  useEffect(() => {
    const fetchDistrict = async () => {
      if (province) {
        const districts = await getDistricts(province.id)
        console.log(districts)
        setDistrictsList(
          districts.map((element: any) => ({
            id: element.id,
            name: element.name_en,
          }))
        )
      }
    }
    fetchDistrict()

    setDistrict(null)
    setSubdistrict(null)
  }, [province])

  useEffect(() => {
    const fetchSubDistrict = async () => {
      if (district) {
        const subdistricts = await getSubDistricts(district.id)
        setSubDistrictsList(
          subdistricts.map((element: any) => ({
            id: element.id,
            name: element.name_en,
          }))
        )
      }
    }
    fetchSubDistrict()

    setSubdistrict(null)
  }, [district])

  if (!isReady) return <SuspenseUI />

  return (
    <main className='bg-white min-h-screen px-14 py-16'>
      <div>
        <h1 className='text-4xl font-bold text-cgr-dark-green mb-8'>
          {title} campground
        </h1>
        <Card>
          <div className='px-14 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 text-lg items-center gap-4'>
              <p>Campground name : </p>
              <TextField
                required
                id='name'
                label='Campground name'
                variant='outlined'
                size='small'
                InputProps={{ style: { borderRadius: '10px' } }}
                className='col-span-2 lg:col-span-3'
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value)
                }}
              />
              <p>Telephone number : </p>
              <TextField
                required
                id='tel'
                label='Telephone number'
                variant='outlined'
                size='small'
                InputProps={{ style: { borderRadius: '10px' } }}
                className='col-span-2 lg:col-span-3'
                value={tel}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setTel(event.target.value)
                }}
              />
              <p className='self-start pt-1'>Address : </p>
              <div className='grid grid-cols-1 md:grid-cols-2 col-span-2 lg:col-span-3 gap-3 items-start'>
                <TextField
                  required
                  id='houseNum'
                  label='House number'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={houseNum}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setHouseNum(event.target.value)
                  }}
                />
                <TextField
                  id='lane'
                  label='Lane'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={lane}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLane(event.target.value)
                  }}
                />
                <TextField
                  id='road'
                  label='Road'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='md:col-span-2'
                  value={road}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setRoad(event.target.value)
                  }}
                />
                {/* <TextField
                  required
                  id='subdistrict'
                  label='Sub-district'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={subdistrict}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSubdistrict(event.target.value)
                  }}
                />
                <TextField
                  required
                  id='district'
                  label='District'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={district}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDistrict(event.target.value)
                  }}
                />
                <TextField
                  required
                  id='province'
                  label='Province'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={province}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProvince(event.target.value)
                  }}
                /> */}
                <Autocomplete
                  disablePortal
                  id='subdistrict'
                  options={subDistrictsList}
                  getOptionLabel={(option: optionType) => `${option.name}`}
                  size='small'
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSubdistrict({ name: newValue.name, id: newValue.id })
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label='Sub-district'
                      value={subdistrict}
                    />
                  )}
                />
                <Autocomplete
                  disablePortal
                  id='district'
                  options={districtsList}
                  getOptionLabel={(option: optionType) => `${option.name}`}
                  size='small'
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setDistrict({ name: newValue.name, id: newValue.id })
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label='District'
                      value={district}
                    />
                  )}
                />
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
                      value={province}
                    />
                  )}
                />
                <TextField
                  required
                  id='postalCode'
                  label='Postal code'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={postalCode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPostalCode(event.target.value)
                  }}
                />
                <TextField
                  id='googleMap'
                  label='Google map link'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='md:col-span-2'
                  value={googleMap}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setGoogleMap(event.target.value)
                  }}
                />
              </div>
              <p>Website : </p>
              <TextField
                id='website'
                label='Website'
                variant='outlined'
                size='small'
                InputProps={{ style: { borderRadius: '10px' } }}
                className='col-span-2 lg:col-span-3'
                value={website}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setWebsite(event.target.value)
                }}
              />
              <p className='self-start pt-1'>Facilities : </p>
              <div className='col-span-2 lg:col-span-3'>
                <FormGroup className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: '#339989',
                          '&.Mui-checked': { color: '#339989' },
                        }}
                        checked={tentForRent}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setTentForRent(event.target.checked)
                        }}
                        name='tentForRent'
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
                </FormGroup>
              </div>
              {params.type == 'create' ? '' : <p>Upload image : </p>}

              {params.type == 'create' ? (
                ''
              ) : (
                <Button
                  component='label'
                  role={undefined}
                  variant='contained'
                  tabIndex={-1}
                  className='bg-cgr-dark-green active:bg-cgr-dark-green hover:bg-cgr-dark-green focus:bg-cgr-dark-green'>
                  {image ? 'Ready' : 'Upload file'}
                  <VisuallyHiddenInput
                    type='file'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (!event.target.files) return

                      const file = event.target.files[0]
                      const formData = new FormData()
                      formData.append('file', file)
                      setImage(formData)
                    }}
                  />
                </Button>
              )}
            </div>
            <div className='flex place-content-center w-full'>
              <button className='cgr-btn mt-8 w-full md:w-2/3' onClick={submit}>
                {submitBtnTitle}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
