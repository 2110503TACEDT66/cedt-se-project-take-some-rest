'use client'

import { Suspense } from 'react'
import SuspenseUI from '@/components/basic/SuspenseUI'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import CampgroundPanelCampgrounds from '@/components/complex/CampgroundPanelCampgrounds'
import getBookmarks from '@/libs/bookmarks/getBookmarks'
import getMe from '@/libs/users/getMe'

export default function Bookmark() {
  const { data: session } = useSession()
  if (!session || !session.user.token) return null

  const [bookmarks, setBookmarks] = useState<CampgroundItem[]>([])
  const [bookmarkedCampgrounds, setBookmarkedCampgrounds] = useState<string[]>([])

  const fetchBookmarkID = async () => {
    if (session) {
      const me = await getMe(session.user.token)
      const bookmarkedCampgrounds = me.data.bookmarkCampgrounds
      setBookmarkedCampgrounds(bookmarkedCampgrounds)
      //console.log(bookmarkedCampgrounds)
    }
  }
  
  const fetchBookMark = async () => {
    if (session) {
      const campgrounds: CampgroundsJson = (
        await getBookmarks(session.user.token)
      )
      setBookmarks(campgrounds.data)
    }
  }

  useEffect(() => {
    fetchBookMark()
    fetchBookmarkID()
  })

  return (
    <main className='px-5 pt-7'>
      <div className='text-4xl font-bold mb-6 z-30 text-cgr-black'>
        My Bookmark
      </div>
      <div className='h-1 w-full mt-5 mb-10 bg-cgr-dark-green rounded-xl'></div>
      {
        bookmarks?
        <CampgroundPanelCampgrounds campgrounds={bookmarks} bookmarkedCampgrounds={bookmarkedCampgrounds}/>
        : <h1>no bookmark yet</h1>
      }
    </main>
  )
}