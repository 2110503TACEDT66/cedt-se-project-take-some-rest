import BookingCard from '@/components/basic/card/BookingCard'

export default function BookingPanel({
  bookings,
}: {
  bookings: BookedReservesItem[]
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {bookings.map((obj) => (
        <BookingCard
          campground={obj.campground}
          site={obj.site}
          date={obj.startDate}
          id={obj._id}
        />
      ))}
    </div>
  )
}
