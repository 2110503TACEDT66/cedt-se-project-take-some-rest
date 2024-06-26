'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import deleteReview from '@/libs/reviews/deleteReview'
import reportReview from '@/libs/reviews/reportReview'
import getMyCampgroundReviews from '@/libs/reviews/getMyCampgroundReviews'
import getReportedReview from '@/libs/reviews/getReportedReview'
import declineReportedReview from '@/libs/reviews/declineReportedReview'
import NoPermissionUI from '@/components/basic/NoPermissionUI'

export default function ReviewTable() {
  const { data: session } = useSession()
  if (
    !session ||
    !session.user.token ||
    (session.user.role !== 'admin' && session.user.role !== 'campgroundOwner')
  )
    return <NoPermissionUI />

  const [isReady, setIsReady] = useState(false)
  const [review, setReview] = useState<reviewItem[]>([])
  const [reportedReviews, setReportedReviews] = useState<reviewItem[]>([])

  const fetchData = async () => {
    setIsReady(false)
    const reviewData: reviewItem[] = (
      await getMyCampgroundReviews(session.user.token)
    ).data
    setReview(reviewData)
    setIsReady(true)
  }
  const fetchReportedData = async () => {
    setIsReady(false)
    const reviewFromFetch: reviewItem[] = (
      await getReportedReview(session.user.token)
    ).data
    setReportedReviews(reviewFromFetch)
    setIsReady(true)
  }

  useEffect(() => {
    fetchData()
    if (session.user.role == 'admin') fetchReportedData()
  }, [])

  const handleReport = async (review: reviewItem) => {
    await reportReview(review._id, session.user.token)
    fetchData()
    if (session.user.role == 'admin') fetchReportedData()
  }

  const handleIgnore = async (review: reviewItem) => {
    await declineReportedReview(review._id, session.user.token)
    fetchData()
    if (session.user.role == 'admin') fetchReportedData()
  }

  const handleDelete = async (review: reviewItem) => {
    await deleteReview(session.user.token, review._id)
    fetchData()
    if (session.user.role == 'admin') fetchReportedData()
  }

  if (!isReady) return <SuspenseUI />

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>
      <h1 className='text-cgr-black text-4xl font-bold mb-4'>Reviews</h1>

      {/* Request */}
      {session.user.role == 'admin' ? (
        <div className='mb-16'>
          <div className='text-cgr-dark-green text-2xl mb-5 font-medium'>
            Reported Reviews
          </div>
          <table className='cgr-table'>
            <tr className='h-10'>
              <th className='w-8/12'>Comment</th>
              <th className='w-2/12'>Rating</th>
              <th className='w-1/12'></th>
              <th className='w-1/12'></th>
            </tr>
            {reportedReviews.map((obj) => (
              <tr key={obj._id}>
                <td>{obj.comment}</td>
                <td className='text-center'>{obj.score}</td>
                <td className='text-center'>
                  <button
                    className='cgr-btn-red'
                    onClick={async () => {
                      if (
                        confirm(`Are you sure you want to delete this review ?`)
                      ) {
                        handleDelete(obj)
                        window.location.reload()
                      }
                    }}>
                    Delete
                  </button>
                </td>
                <td className='text-center'>
                  <button
                    className='cgr-btn'
                    onClick={async () => {
                      if (
                        confirm(`Are you sure you want to ignore this review ?`)
                      ) {
                        handleIgnore(obj)
                        window.location.reload()
                      }
                    }}>
                    Ignore
                  </button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : null}

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
            <td className='text-center'>{obj.score}</td>
            <td className='text-center'>{obj.campground.name}</td>
            <td className='text-center'>{obj.user.name}</td>
            <td className='text-center'>
              {session.user.role == 'admin' ? (
                <i
                  className='bi bi-trash3-fill ml-auto mt-auto cursor-pointer hover:text-cgr-red'
                  onClick={() => {
                    handleDelete(obj)
                  }}></i>
              ) : obj.isReport ? (
                <p className='text-sm'>reported</p>
              ) : (
                <i
                  className='bi bi-flag-fill ml-auto mt-auto cursor-pointer hover:text-cgr-red'
                  onClick={() => {
                    handleReport(obj)
                  }}></i>
              )}
            </td>
          </tr>
        ))}
      </table>
    </main>
  )
}
