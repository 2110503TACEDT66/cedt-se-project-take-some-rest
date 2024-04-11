'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TextField, Rating } from "@mui/material";
import { useEffect, useState } from "react";

import Card from "@/components/basic/card/Card";
import Image from "next/image";
import getCampground from '@/libs/campgrounds/getCampground';

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

    //mockup
    const createReview = (a:string, b:string, c:number, d:string) => {} 

    const submit = () => {
      if(
          params.cgid &&
          rating
      ) {
          const callAPI = async () => {
              await createReview(
                  session.user.token,
                  params.cgid,
                  rating,
                  reviewText
              )
          }
          callAPI()
          alert(
              `create review successfully`
          )
          router.back()
      } else {
          alert('Please provide rating')
      }
    }

    useEffect(() => {
        const fetchCampgroundName = async () => {
          const campground: CampgroundItem = (await getCampground(params.cgid)).data
          setCampgroundName(campground.name)
          setCampgroundImage(`${process.env.BACKEND_URL}/images/${campground.pictures[0]}`)
        }
        fetchCampgroundName()
    })

    return (
    <main className="flex justify-center py-12">
      <div className="w-2/3">
      <Card>
        <div className='w-full h-60 relative rounded-t-xl'>
          <Image
            src={campgroundImage}
            alt={`${campgroundName} picture`}
            fill={true}
            className='object-cover rounded-t-xl'
          />
        </div>
        <h1 className='text-3xl font-semibold text-cgr-dark-green flex justify-center py-6'>
          {campgroundName}
        </h1>
        <div className='px-4 md:px-16 lg:px-36 xl:px-40 py-3'>
          <div className='flex flex-col justify-start text-lg gap-5 mb-3'>
            <Rating
              name="campground-rating"
              size="large"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              ></Rating>
            <TextField
              id='review'
              label='your review'
              variant='outlined'
              size='small'
              InputProps={{ style: { borderRadius: '10px' } }}
              className='w-full mb-2'
              placeholder="share your experience"
              multiline
              rows={4}
              value={reviewText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setReviewText(event.target.value)
              }}
            />
          </div>
          <div className='flex flex-row justify-end mt-4 mb-6'>
            <button className='cgr-btn w-[35%]' onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      </Card>
      </div>
    </main>
  );
}