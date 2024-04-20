import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'

import Card from '@/components/basic/card/Card'
import CampgroundDetail from '@/components/complex/CampgroundDetail'
import getCampground from '@/libs/campgrounds/getCampground'
import getCampgroundSites from '@/libs/campgrounds/getCampgroundSites'
import getReviews from '@/libs/reviews/getReviews'
import ReviewsPanel from '@/components/complex/ReviewPanel'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function ViewCampground({
  params,
}: {
  params: { cgid: string }
}) {
  const session = await getServerSession(authOptions)

  const campground: CampgroundItem = (await getCampground(params.cgid)).data

  const reviews = (await getReviews(params.cgid)).data

  const campgroundSites: CampgroundSitesJson = await getCampgroundSites(
    params.cgid
  )

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
  const address: string[] = []
  for (let type of addressType) {
    let sth = campground.address[type]
    address.push(sth)
  }
  const addressString = address.join(' ')

  return (
    <main className='px-4 py-14 sm:px-10 md:px-16 lg:px-36 xl:px-52 2xl:px-80'>
      <Card>
        {/* campground detail */}
        <div className='p-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h1 className='text-3xl font-bold text-cgr-dark-green'>
                {campground.name}
              </h1>
              <CampgroundDetail
                address={addressString}
                googleMap={campground.address.link}
                website={campground.website}
                tel={campground.tel}
                facilities={campground.facilities}
              />
            </div>
            <div className='h-full w-full'>
              {campground.pictureString ? (
                <Image
                  src={`data:image/png;base64,${campground.pictureString}`}
                  alt={`${campground.name} picture`}
                  width={0}
                  height={0}
                  sizes='100vw'
                  style={{ objectFit: 'cover' }}
                  className='w-full h-full rounded-lg'></Image>
              ) : (
                <div className='rounded-xl shadow-none bg-cgr-gray-10 w-full h-full flex items-center justify-center'>
                  <div>
                    <i className='bi bi-image h-full text-3xl'></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* site */}
        <div className='px-10 py-4'>
          <div className='flex flex-row items-end'>
            <h1 className='text-2xl font-semibold text-cgr-dark-green mr-2'>
              {campground.amount}
            </h1>
            <h1 className='text-lg font-medium'>Sites</h1>
          </div>
          <table className='cgr-table'>
            <tr>
              <th>Zone</th>
              <th>Site Number</th>
              <th>Size</th>
              <th>View</th>
            </tr>
            {campgroundSites.sites.map((obj) => (
              <tr key={obj._id} className='text-center'>
                <td>{obj.zone}</td>
                <td>{obj.number}</td>
                <td>{obj.size.swidth + '*' + obj.size.slength}</td>
                <td>
                  <Link href={`/campgrounds/view/${params.cgid}/${obj._id}`}>
                    <button className='cgr-btn-outline-gray'>view</button>
                  </Link>
                </td>
              </tr>
            ))}
          </table>
        </div>

        {/* add review button & avg rating*/}
        <div className='flex flex-row justify-between px-10 pt-5'>
          <p className='px-4 pt-2 text-3xl font font-medium'>
            {' '}
            Rating :{' '}
            {!campground.averageScore
              ? '0'
              : campground.averageScore.toFixed(1)}{' '}
          </p>
          {session ? (
            <Link href={`/reviews/${params.cgid}`}>
              <button className='cgr-btn'>Add Your Review</button>
            </Link>
          ) : (
            ''
          )}
        </div>

        {/* review */}
        <div className='px-10 py-4 text-black z-50 text-lg text-center'>
          {reviews.length > 0 ? (
            <ReviewsPanel reviews={reviews} />
          ) : (
            <p className='m-6'>No review yet</p>
          )}
        </div>
      </Card>
    </main>
  )
}
