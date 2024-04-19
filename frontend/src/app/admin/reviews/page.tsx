'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import getUsers from '@/libs/users/getUsers'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import getReviews from '@/libs/reviews/getReviews'

export default function ReviewTable() {
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const [isReady, setIsReady] = useState(false)
  const [review, setReview] = useState<reviewItem[]>([])

  const fetchData = async () => {
    setIsReady(false)
    const reviewData: reviewItem[] = (
      //edit API here (get all review)
      await  getReviews('66024afe9fd7c52c54b67f49') 
    ).data
    setReview(reviewData)
    setIsReady(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  //mock API for report review
  const reportReviewMock = (review : reviewItem) => {}
  const report = async (review : reviewItem) => {
    await reportReviewMock(review)
  }

  //mock API for delete review
  const deleteReviewMock = (review : reviewItem) => {}
  const deleteR = async (review : reviewItem) => {
    await deleteReviewMock(review)
  }

  if (!isReady) return <SuspenseUI />

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>

      <h1 className='text-cgr-black text-4xl font-bold mb-4'>Reviews</h1>

      {/* Request */}
      

      {/* Normal */}
      <div className='text-cgr-dark-green text-2xl mb-5 font-medium'>
        User Reviews
      </div>
      <table className='cgr-table'>
        <tr className='h-10'>
          <th className='w-6/12'>Comment</th>
          <th className='w-1/12'>Rating</th>
          <th className='w-2/12'>Campground</th>
          <th className='w-2/12'>User</th>
          <th className='w-1/12'></th>
        </tr>
        {review.map((obj) => (
          <tr key={obj._id}>
            <td>{obj.comment}</td>
            <td className='text-center'>
              {obj.score}
            </td>
            <td className='text-center'>
              {obj.campground.name}
            </td>
            <td className='text-center'>
              {obj.user.name}
            </td>
            <td className='text-center'>
              {session.user.role == 'admin' ? (
                <i
                className='bi bi-trash3-fill ml-auto mt-auto'
                onClick={()=>{deleteR(obj)}}></i>
              ) : obj.isReport ? (
                <p className='text-sm'>reported</p>
              ) : (
                <i
                  className='bi bi-flag-fill ml-auto mt-auto'
                  onClick={()=>{report(obj)}}></i>
              )}
            </td>
          </tr>
        ))}
      </table>
    </main>
  )
}
