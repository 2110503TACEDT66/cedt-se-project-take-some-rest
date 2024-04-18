'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import CampgroundPanelCampgrounds from '@/components/complex/CampgroundPanelCampgrounds'
import getBookmarks from '@/libs/bookmarks/getBookmarks'

export default function Bookmark() {
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const [bookmarks, setBookmarks] = useState<CampgroundItem[]>([])
  const [bookmarkCgids, setBookmarkCgids] = useState<string[]>([])

  const fetchBookmarkID = () => {
    for (const campground of bookmarks) {
      setBookmarkCgids((bookmarkCgids) => [...bookmarkCgids, campground._id])
    }
  }

  const fetchBookMark = async () => {
    if (session) {
      const campgrounds: CampgroundsJson = await getBookmarks(
        session.user.token
      )
      setBookmarks(campgrounds.data)
    }
  }

  const handleBookmarkChange = async (id: string, isAdd: boolean) => {
    const campgrounds = bookmarks.filter((obj) => obj._id != id)
    const campgroundIds = bookmarkCgids.filter((obj) => obj != id)
    setBookmarks(campgrounds)
    setBookmarkCgids(campgroundIds)
  }

  useEffect(() => {
    fetchBookMark()
  }, [])

  useEffect(() => {
    fetchBookmarkID()
  }, [bookmarks])

  return (
    <main className='px-12 pt-9'>
      <div className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
        My Bookmark
      </div>
      <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
      {bookmarks.length > 0 ? (
        <CampgroundPanelCampgrounds
          campgrounds={bookmarks}
          bookmarkedCampgroundIds={bookmarkCgids}
          handleChange={handleBookmarkChange}
        />
      ) : (
        <p className='text-2xl font-semibold text-center'>No bookmark yet</p>
      )}
    </main>
  )
}
