'use client'

import { Rating } from '@mui/material'
import deleteReview from '@/libs/reviews/deleteReview'
import { useSession } from 'next-auth/react'

export default function ReviewCard({ review }: { review: reviewItem }) {
  const { data: session } = useSession()
  const isMyReview = session?.user._id === review.user._id
  var isMyCampGround = session?.user._id == review.campground.campgroundOwner

  const handleDelete = async () => {
    if (session) {
      await deleteReview(session.user.token, review._id)
    }
    location.reload()
  }

  //mock API
  const reportReviewMock = (review : reviewItem) => {}
  const report = async () => {
    if (isMyCampGround) {
      await reportReviewMock(review)
    }
  }

  return (
    <div className='w-full h-44 shadow-[7px_7px_12px_#EFEFEF,-7px_-7px_12px_#F7F7F7] rounded-xl bg-white text-[#343434] flex justify-center'>
      <div className='flex flex-col w-[90%] m-8'>
        <div className='flex flex-row justify-between'>
          <p className='font-semibold text-xl text-start'>{review.user.name}</p>
          <Rating
            name={`${review.user.name}Rating`}
            value={review.score}
            readOnly></Rating>
        </div>

        {review.comment ? (
          <p className='block text-start'>{review.comment}</p>
        ) : (
          <p className='block text-cgr-gray-40 font-medium'> no comment </p>
        )}

        {isMyReview || session?.user.role == 'admin' ? (
          <i
            className='bi bi-trash3 ml-auto mt-auto cursor-pointer hover:text-cgr-red transition-colors'
            onClick={() => handleDelete}></i>
        ) : review.isReport ? (
          <h1 className='text-sm text-cgr-gray-50 ml-auto mt-auto'>
            reported
          </h1>
        ) : isMyCampGround ? (
          <i
            className='bi bi-flag ml-auto mt-auto cursor-pointer hover:text-cgr-red transition-colors'
            onClick={report}></i>
        ) : null }

      </div>
    </div>
  )
}
