'use client'

import { useEffect, useState } from 'react'
import { TextField, styled } from '@mui/material'
import Button from '@mui/material/Button'

import Card from '@/components/basic/card/Card'
import SuspenseUI from '@/components/basic/SuspenseUI'
import getCampground from '@/libs/campgrounds/getCampground'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import getCampgroundSite from '@/libs/campgrounds/getCampgroundSite'
import createCampgroundSite from '@/libs/campgrounds/createCampgroundSite'
import updateCampgroundSite from '@/libs/campgrounds/updateCampgroundSite'
import NoPermissionUI from '@/components/basic/NoPermissionUI'

export default function createCampground({
  params,
}: {
  params: { type: string; cgid: string }
}) {
  const router = useRouter()

  const { data: session } = useSession()
  if (
    !session ||
    !session.user.token ||
    (session.user.role !== 'admin' && session.user.role !== 'campgroundOwner')
  )
    return <NoPermissionUI />

  const urlParams = useSearchParams()
  const sid = urlParams.get('sid')

  const title = params.type === 'create' ? 'Create new site' : 'Edit site'
  const submitBtnTitle = params.type === 'create' ? 'Create' : 'Edit'

  const [campground, setCampground] = useState<CampgroundItem>()
  const [addressString, setAddressString] = useState('')
  const [isReady, setIsReady] = useState(false)

  const [zone, setZone] = useState('')
  const [siteNo, setSiteNo] = useState<number>()
  const [siteSizeW, setSiteSizeW] = useState<number>()
  const [siteSizeL, setSiteSizeL] = useState<number>()
  const [image, setImage] = useState<FormData>()

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

  const addressType: (keyof {
    houseNumber: string
    lane: string
    road: string
    subDistrict: string
    district: string
    province: string
    postalCode: string
    link: string
  })[] = [
    'houseNumber',
    'lane',
    'road',
    'subDistrict',
    'district',
    'province',
    'postalCode',
  ]

  useEffect(() => {
    const fetch = async () => {
      const campgroundFromFetch = (await getCampground(params.cgid)).data
      setCampground(campgroundFromFetch)

      const address: string[] = []
      for (let type of addressType) {
        let data = campgroundFromFetch.address[type]
        address.push(data)
      }
      setAddressString(address.join(' '))

      if (params.type == 'edit') {
        if (!sid) return
        const campgrundSiteFromFetch: CampgroundSiteItem = (
          await getCampgroundSite(params.cgid, sid)
        ).site

        setZone(campgrundSiteFromFetch.zone)
        setSiteNo(campgrundSiteFromFetch.number)
        setSiteSizeW(campgrundSiteFromFetch.size.swidth)
        setSiteSizeL(campgrundSiteFromFetch.size.slength)
      }
    }
    fetch()
    setIsReady(true)
  }, [])

  const submit = () => {
    if (!zone || !siteNo || !siteSizeW || !siteSizeL) {
      alert('Please provide all required information')
    } else {
      const size = {
        swidth: siteSizeW,
        slength: siteSizeL,
      }
      const callAPI = async () => {
        if (params.type === 'create') {
          let response = await createCampgroundSite(
            session.user.token,
            params.cgid,
            zone,
            siteNo,
            size
          )
          if (image) {
            try {
              await fetch(
                `${process.env.BACKEND_URL}/api/campgrounds/${params.cgid}/sites/${response?.newSite?._id}/upload-image`,
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
        } else {
          if (!sid) return null
          await updateCampgroundSite(
            session.user.token,
            params.cgid,
            sid,
            zone,
            siteNo,
            size
          )

          if (image) {
            try {
              const response = await fetch(
                `${process.env.BACKEND_URL}/api/campgrounds/${params.cgid}/sites/${sid}/upload-image`,
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
      router.push(`/admin/campgrounds/view/${params.cgid}`)
    }
  }

  if (!campground || !isReady) return <SuspenseUI />

  return (
    <main className='bg-white px-4 py-4 sm:px-10 md:px-16 lg:px-36 xl:px-72 2xl:px-96 min-h-screen '>
      <h1 className='text-4xl font-bold text-cgr-dark-green py-6'>{title}</h1>
      <Card>
        <div className='ml-12 py-8'>
          <strong className='text-2xl'>
            Site in{' '}
            <span className='text-cgr-dark-green'>{campground.name}</span>
          </strong>
          <div className='flex flex-row text-x mt-4'>
            <strong className='mr-3'>Address: </strong> {addressString}
          </div>
          <div className='flex flex-row text-x mt-4'>
            <strong className='mr-3'>Tel: </strong> {campground.tel}
          </div>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className='mb-10'>
          <hr style={{ width: '90%' }} />
        </div>
        <div className='px-6'>
          <div className='text-lg gap-5 mb-8 flex flex-col ml-12'>
            <div className='flex flex-row items-center mr-12 '>
              <div className='w-2/5'>
                <p className='font-medium'>Zone :</p>
              </div>
              <div className='w-3/5'>
                <TextField
                  required
                  id='zone'
                  label='Zone'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-full'
                  value={zone}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setZone(event.target.value)
                  }}
                />
              </div>
            </div>
            <div className='flex flex-row items-center mr-12 '>
              <div className='w-2/5'>
                <p className='font-medium'>Site number :</p>
              </div>
              <div className='w-3/5'>
                <TextField
                  required
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id='siteno'
                  label='Site number'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  className='w-full'
                  value={siteNo}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSiteNo(Number(event.target.value))
                  }}
                />
              </div>
            </div>
            <div className='flex flex-row items-center mr-12'>
              <div className='w-2/5'>
                <p className='font-medium'>Site size :</p>
              </div>
              <div className='w-3/5 grid grid-cols-2 gap-1'>
                <TextField
                  required
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id='sitewidth'
                  label='Width (Meter)'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={siteSizeW}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSiteSizeW(Number(event.target.value))
                  }}
                />
                <TextField
                  required
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id='sitelength'
                  label='Length (Meter)'
                  variant='outlined'
                  size='small'
                  InputProps={{ style: { borderRadius: '10px' } }}
                  value={siteSizeL}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSiteSizeL(Number(event.target.value))
                  }}
                />
              </div>
            </div>
            <div className='flex flex-row items-center mr-12'>
              <div className='w-2/5'>
                <p className='w-fit font-medium'>Upload image : </p>
              </div>
              <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                className='bg-cgr-dark-green active:bg-cgr-dark-green hover:bg-cgr-dark-green focus:bg-cgr-dark-green w-3/5'>
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
            </div>

            <div className='flex justify-center mt-5 mb-10'>
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
