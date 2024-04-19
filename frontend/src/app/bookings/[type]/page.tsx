'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MenuItem, Select, TextField } from '@mui/material'

import getReserve from '@/libs/bookings/getReserve'
import Card from '@/components/basic/card/Card'
import SuspenseUI from '@/components/basic/SuspenseUI'
import createReserve from '@/libs/bookings/createReserve'
import updateReserve from '@/libs/bookings/updateReserve'
import getCampgrounds from '@/libs/campgrounds/getCampgrounds'
import getCampgroundSites from '@/libs/campgrounds/getCampgroundSites'

export default function CreateBooking({
  params,
}: {
  params: { type: string }
}) {
  const router = useRouter()
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const urlParams = useSearchParams()
  const paramsRid = urlParams.get('rid')
  const paramsCgid = urlParams.get('cgid')
  const paramsSid = urlParams.get('sid')
  const title = params.type === 'create' ? 'Create new' : 'Edit'
  const submitBtnTitle = params.type === 'create' ? 'Book' : 'Done'

  const [campgroundsList, setCampgroundsList] = useState<CampgroundItem[]>([])
  const [zonesList, setZonesList] = useState<string[]>([])
  const [sitesList, setSitesList] = useState<CampgroundSiteItem[]>([])

  const [isReady, setIsReady] = useState(false)
  const [cgid, setCgid] = useState('')
  const [zone, setZone] = useState('')
  const [sid, setSid] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [amount, setAmount] = useState(1)
  const [tentSizeW, setTentSizeW] = useState(5)
  const [tentSizeL, setTentSizeL] = useState(5)
  const [date, setDate] = useState('')

  const submit = () => {
    if (
      cgid &&
      zone &&
      sid &&
      preferredName &&
      amount &&
      tentSizeW &&
      tentSizeL &&
      date
    ) {
      const callAPI = async () => {
        const tentSize = {
          swidth: Number(tentSizeW),
          slength: Number(tentSizeL),
        }
        if (params.type === 'create') {
          await createReserve(
            session.user.token,
            cgid,
            sid,
            date,
            tentSize,
            amount,
            preferredName
          )
        } else {
          if (!paramsRid) return null
          await updateReserve(
            session.user.token,
            paramsRid,
            cgid,
            sid,
            date,
            tentSize,
            amount,
            preferredName
          )
        }
      }
      callAPI()
      router.back()
    } else {
      alert('Please provide all required information')
    }
  }

  useEffect(() => {
    setPreferredName(session.user.name)

    const fetchCampgrounds = async () => {
      const campgrounds = (await getCampgrounds()).data
      setCampgroundsList(campgrounds)
    }
    fetchCampgrounds()

    if (params.type === 'edit') {
      const fetchData = async () => {
        if (!paramsRid) return null
        const reserve = (await getReserve(session.user.token, paramsRid)).data
        setCgid(reserve.campground._id)
        const sites = (
          await getCampgroundSites(
            reserve.campground._id,
            'limit=1000&sort=number'
          )
        ).sites
        setSitesList(sites)

        let zones: string[] = Array.from(
          new Set(sites.map((element: CampgroundSiteItem) => element.zone))
        )
        setZonesList(zones)
        setZone(reserve.site.zone)
        setSid(reserve.site._id)
        setPreferredName(reserve.preferredName)
        setAmount(reserve.amount)
        setTentSizeL(reserve.tentSize.slength)
        setTentSizeW(reserve.tentSize.swidth)
        setDate(reserve.startDate.split('T')[0])
        setIsReady(true)
      }
      fetchData()
    } else {
      const fetchData = async () => {
        if (!paramsCgid) {
          setIsReady(true)
          return null
        }
        setCgid(paramsCgid)
        const sites = (
          await getCampgroundSites(paramsCgid, 'limit=1000&sort=number')
        ).sites
        setSitesList(sites)

        let zones: string[] = Array.from(
          new Set(sites.map((element: CampgroundSiteItem) => element.zone))
        )
        setZonesList(zones)

        if (!paramsSid) {
          setIsReady(true)
          return null
        }
        setSid(paramsSid)
        setZone(
          sites.find((element: CampgroundSiteItem) => element._id === paramsSid)
            .zone
        )
        setIsReady(true)
      }
      fetchData()
    }
  }, [])

  useEffect(() => {
    if (isReady) {
      const fetchData = async () => {
        const sites = (await getCampgroundSites(cgid, 'limit=1000&sort=number'))
          .sites
        setSitesList(sites)

        let zones: string[] = Array.from(
          new Set(sites.map((element: CampgroundSiteItem) => element.zone))
        )
        setZonesList(zones)

        setSid('')
        setZone('')
      }
      fetchData()
    }
  }, [cgid])

  if (!isReady) return <SuspenseUI />

  return (
    <main className='bg-white px-4 py-8 sm:px-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen '>
      <Card>
        <div className='pb-16'>
          <h1 className='text-4xl font-bold text-cgr-dark-green flex justify-center py-12'>
            {title} Booking
          </h1>
          <div className='px-6'>
            <div className='text-lg gap-5 mb-8 flex flex-col mx-12'>
              <div className='flex flex-row mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium text-l '>Campground Name:</p>
                </div>
                <Select
                  labelId='CamgroundName'
                  id='campground-name'
                  value={cgid}
                  size='small'
                  onChange={(e) => setCgid(e.target.value)}
                  className='w-full'>
                  {campgroundsList.map((obj) => (
                    <MenuItem value={obj._id} key={obj._id}>
                      {obj.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className='flex flex-row items-center mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium'>Zone:</p>
                </div>
                <Select
                  labelId='Zone'
                  id='zone'
                  value={zone}
                  size='small'
                  onChange={(e) => setZone(e.target.value)}
                  className='w-full'>
                  {zonesList.map((obj) => (
                    <MenuItem value={obj} key={obj}>
                      {obj}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className='flex flex-row items-center mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium'>Site Number:</p>
                </div>
                <Select
                  labelId='Site Number'
                  id='sitenumber'
                  value={sid}
                  size='small'
                  onChange={(e) => {
                    setSid(e.target.value)
                  }}
                  className='w-full'>
                  {sitesList
                    .filter((element) => element.zone === zone)
                    .map((obj) => (
                      <MenuItem value={obj._id} key={obj._id}>
                        {obj.number}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div className='flex flex-row items-center mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium'>Preferred Name:</p>
                </div>
                <TextField
                  required
                  id='preferredName'
                  label='Name'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-full'
                  value={preferredName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPreferredName(event.target.value)
                  }}
                />
              </div>
              <div className='flex flex-row items-center mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium'>Amount:</p>
                </div>
                <TextField
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id='amount'
                  label='Amount'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-full'
                  value={amount}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAmount(Number(event.target.value))
                  }}
                />
              </div>
              <div className='flex flex-row items-center mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium'>Tent Size:</p>
                </div>
                <TextField
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id='tentSizeW'
                  label='Width(meter)'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-1/2 mr-4'
                  value={tentSizeW}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTentSizeW(Number(event.target.value))
                  }}
                />
                <TextField
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id='tentSizeL'
                  label='Length(meter)'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-1/2'
                  value={tentSizeL}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTentSizeL(Number(event.target.value))
                  }}
                />
              </div>
              <div className='flex flex-row items-center mr-6'>
                <div className='w-1/3'>
                  <p className='font-medium'>Date:</p>
                </div>
                <TextField
                  type='date'
                  id='date'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-full'
                  value={date}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDate(event.target.value)
                  }}
                />
              </div>
            </div>
            <div className='flex justify-center'>
              <button className='cgr-btn w-1/2' onClick={submit}>
                {submitBtnTitle}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
