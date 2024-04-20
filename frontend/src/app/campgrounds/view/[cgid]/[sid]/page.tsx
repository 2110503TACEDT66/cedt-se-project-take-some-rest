import Card from '@/components/basic/card/Card'
import CampgroundDetail from '@/components/complex/CampgroundDetail'
import Calendar from '@/components/basic/Calendar'
import Link from 'next/link'
import getCampgroundSite from '@/libs/campgrounds/getCampgroundSite'
import getBookedReserves from '@/libs/bookings/getBookedReserves'
import Image from 'next/image'

export default async function ViewCampgroundSite({
  params,
}: {
  params: { cgid: string; sid: string }
}) {
  const campgroundSiteJson: CampgroundSiteJson = await getCampgroundSite(
    params.cgid,
    params.sid
  )
  const campground: CampgroundItem = campgroundSiteJson.campground
  const campgroundSite: CampgroundSiteItem = campgroundSiteJson.site

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

  // alforithm to find the month to show in availablilty
  const today = new Date(Date.now())
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const lastDay = new Date(year, month + 2, 0)
  const lastMonth = lastDay.getMonth() + 1
  const lastYear = lastDay.getFullYear()

  const reserveDateJson: BookedReservesJson = await getBookedReserves(
    `site=${params.sid}&startDate[gte]=${year}-${month}-01&startDate[lte]=${lastYear}-${lastMonth + 1}-${lastDay.getDate()}&sort=startDate`
  )
  const reserveDate: Date[] = reserveDateJson.data.map((obj) => {
    return new Date(obj.startDate)
  })

  const firstMonthReserveDate: Date[] = reserveDate.filter(
    (obj) => obj.getMonth() + 1 == month
  )
  const secondMonthReserveDate: Date[] = reserveDate.filter(
    (obj) => obj.getMonth() + 1 != month && obj.getMonth() + 1 != lastMonth
  )
  const thirdMonthReserveDate: Date[] = reserveDate.filter(
    (obj) => obj.getMonth() + 1 == lastMonth
  )

  let firstMonthReserve: number[] = []
  firstMonthReserveDate.forEach((obj) => {
    firstMonthReserve.push(obj.getDate())
  })

  let secondMonthReserve: number[] = []
  secondMonthReserveDate.forEach((obj) => {
    secondMonthReserve.push(obj.getDate())
  })

  let thirdMonthReserve: number[] = []
  thirdMonthReserveDate.forEach((obj) => {
    thirdMonthReserve.push(obj.getDate())
  })

  return (
    <main className='px-4 py-14 sm:px-10 md:px-16 lg:px-32 xl:px-48 2xl:px-80'>
      <Card>
        {/* campground detail */}
        <div className='p-10'>
          <h1 className='text-3xl font-bold text-cgr-dark-green'>
            {campground.name}
          </h1>
          <div className='flex flex-wrap justify-between mt-2 mb-4'>
            <h2 className='text-2xl font-medium text-cgr-dark-green'>
              Zone : {campgroundSite.zone} | Number : {campgroundSite.number}
            </h2>
            <p className='text-lg'>
              size :{' '}
              {`${campgroundSite.size.slength} * ${campgroundSite.size.swidth}`}
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='flex flex-col justify-start'>
              <CampgroundDetail
                address={addressString}
                googleMap={campground.address.link}
                website={campground.website}
                tel={campground.tel}
                facilities={campground.facilities}
              />
              <Link
                href={`/bookings/create?sid=${params.sid}&cgid=${params.cgid}`}
                className='left-0 w-full lg:w-fit h-fit mt-5'>
                <button className='cgr-btn'>Book Now</button>
              </Link>
            </div>
            <div className='w-full col-span-1'>
              {campgroundSite.pictureString ? (
                <Image
                  src={`data:image/png;base64,${campgroundSite.pictureString}`}
                  alt={`${campgroundSite.zone} picture`}
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
          <hr></hr>
          <div className='text-center my-5'>
            <h1 className='text-2xl font-semibold text-cgr-dark-green mr-2'>
              Availability
            </h1>
          </div>
          <div className='flex flex-wrap justify-center px-0 md:px-14px-48 mb-5 gap-16'>
            <Calendar
              month={month}
              year={year}
              unavailableDates={firstMonthReserve}
            />
            <Calendar
              month={month + 1}
              year={year}
              unavailableDates={secondMonthReserve}
            />
            <Calendar
              month={month + 2}
              year={year}
              unavailableDates={thirdMonthReserve}
            />
          </div>
        </div>
      </Card>
    </main>
  )
}
