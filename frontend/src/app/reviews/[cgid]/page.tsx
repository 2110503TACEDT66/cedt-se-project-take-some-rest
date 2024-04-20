'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TextField, Rating } from '@mui/material'
import { useEffect, useState } from 'react'

import Card from '@/components/basic/card/Card'
import Image from 'next/image'
import getCampground from '@/libs/campgrounds/getCampground'
import createReview from '@/libs/reviews/createReview'

export default function createReviewPage({
  params,
}: {
  params: { cgid: string }
}) {
  const router = useRouter()
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const [campgroundName, setCampgroundName] = useState('')
  const [campgroundImage, setCampgroundImage] = useState('')
  const [rating, setRating] = useState<number | null>(0)
  const [reviewText, setReviewText] = useState('')

  const submit = () => {
    if (params.cgid && rating) {
      const callAPI = async () => {
        await createReview(session.user.token, params.cgid, rating, reviewText)
      }
      callAPI()

      router.push(`/campgrounds/view/${params.cgid}`)
    } else {
      alert('Please provide rating')
    }
  }

  useEffect(() => {
    const fetchCampgroundName = async () => {
      const campground: CampgroundItem = (await getCampground(params.cgid)).data
      setCampgroundName(campground.name)
      setCampgroundImage(`data:image/png;base64,${campground.pictureString}`)
    }
    fetchCampgroundName()
  }, [])

  console.log(campgroundImage)

  return (
    <main className='flex justify-center py-12'>
      <div className='w-1/2'>
        <Card>
          <div className='w-full h-60 relative rounded-t-xl'>
            {campgroundImage != '' ? (
              <Image
                src={campgroundImage}
                alt={`${campgroundName} picture`}
                fill={true}
                className='object-cover rounded-t-xl'
              />
            ) : (
              <div className='w-full h-full bg-cgr-dark-green rounded-t-xl'></div>
            )}
          </div>
          <h1 className='text-3xl font-semibold text-cgr-dark-green flex justify-center pt-5 pb-2'>
            {campgroundName}
          </h1>
          <div className='px-4 md:px-16 lg:px-36 xl:px-40 py-3'>
            <div className='flex flex-col justify-start text-lg gap-5 mb-3'>
              <div className='flex flex-row content-center'>
                <h1 className='text-md font-medium my-auto mr-3'>rating </h1>
                <Rating
                  name='campground-rating'
                  size='large'
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue)
                  }}></Rating>
              </div>
              <TextField
                id='review'
                label='your review'
                variant='outlined'
                size='small'
                InputProps={{ style: { borderRadius: '10px' } }}
                className='w-full mb-2'
                placeholder='share your experience'
                multiline
                rows={4}
                value={reviewText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setReviewText(event.target.value)
                }}
              />
            </div>
            <div className='flex flex-row justify-end mt-4 mb-6'>
              <button className='cgr-btn w-[45%]' onClick={submit}>
                Submit
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
