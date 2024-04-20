'use client'

import Image from 'next/image'
import Link from 'next/link'

import Card from '@/components/basic/card/Card'
import Tag from '@/components/basic/Tag'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import addBookmark from '@/libs/bookmarks/addBookmark'
import removeBookmark from '@/libs/bookmarks/removeBookmark'
import { useEffect } from 'react'

export default function CampgroundCardCampgrounds({
  campground,
  isBookmarked,
  handleChange,
}: {
  campground: CampgroundItem
  isBookmarked: boolean
  handleChange?: Function
}) {
  //set up that if this campground is in book mark then let the use state be true
  //console.log(isBookmark)
  //console.log(campground.name)
  const [bookmark, setBookmark] = useState(isBookmarked)
  const { data: session } = useSession()

  useEffect(() => {
    setBookmark(isBookmarked)
  }, [isBookmarked])

  const handleClickBookmark = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    if (session) {
      if (!bookmark) {
        await addBookmark(session.user.token, campground._id)
      } else {
        await removeBookmark(session.user.token, campground._id)
        if (handleChange) {
          handleChange(campground._id, false)
        }
      }
    }
    setBookmark(!bookmark)
  }

  return (
    <Link
      href={`/campgrounds/view/${campground._id}`}
      className='hover:scale-105 duration-300'>
      <Card>
        <div className='p-0 flex flex-row'>
          {campground.pictureString ? (
            <Image
              src={`data:image/png;base64,${campground.pictureString}`}
              alt={`${campground.name} picture`}
              width={0}
              height={0}
              sizes='100vw'
              className='object-cover w-1/4 rounded-l-xl shadow-none'></Image>
          ) : (
            <div className='w-1/4 rounded-l-xl shadow-none bg-cgr-light-green'></div>
          )}
          <div className='w-3/4 p-6'>
            {/* Card Title */}
            <div className='mb-4'>
              <p className='text-2xl font-bold text-cgr-black'>
                {campground.name}
              </p>
              {campground.address ? (
                <p className='text-md font-light'>
                  {campground.address.province}
                </p>
              ) : (
                <p></p>
              )}
            </div>

            {/* Card Detail */}
            <div className='my-4 flex flex-col space-y-1 text-sm'>
              <div className='flex flex-row'>
                <i className='bi bi-signpost-split w-fill me-3'></i>
                <p>Site available : {campground.amount}</p>
              </div>
              <div className='flex flex-row'>
                <i className='bi bi-telephone w-fill me-3'></i>
                <p className=''>Tel : {campground.tel}</p>
              </div>
            </div>

            {/* Facility */}
            {campground.facilities ? (
              <div className='flex flex-row space-x-2 overflow-auto'>
                {campground.facilities.map((data) => (
                  <Tag size='xs' key={data}>
                    {data}
                  </Tag>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {session ? (
            <div className='mt-5 mr-5' onClick={handleClickBookmark}>
              {bookmark ? (
                <i className='bi bi-bookmark-check-fill text-xl'></i>
              ) : (
                <i className='bi bi-bookmark-fill text-xl text-[#ECECEC]'></i>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </Card>
    </Link>
  )
}
