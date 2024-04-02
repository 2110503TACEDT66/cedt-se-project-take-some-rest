import { getMonthName } from '@/utils/dateUtils'

export default function Component({
  month,
  year,
  unavailableDates,
}: {
  month: number
  year: number
  unavailableDates: (number | undefined)[]
}) {
  month -= 1
  const totalDay = new Date(year, month + 1, 0).getDate()
  const monthName = getMonthName(month)
  const beforeThisMonth = new Date(year, month, 1).getDay()

  let availability = []

  for (let day = 1; day <= beforeThisMonth; day++) {
    availability.push(
      <div
        className='bg-transparent text-xs text-center w-5 h-5'
        key={day * -1}></div>
    )
  }

  for (let day = 1; day <= totalDay; day++) {
    if (unavailableDates.includes(day)) {
      availability.push(
        <div className='bg-cgr-red text-xs text-center w-5 h-5' key={day}></div>
      )
    } else {
      availability.push(
        <div
          className='bg-cgr-gray-40 text-xs text-center w-5 h-5 py-0.5 px-auto'
          key={day}>
          {day}
        </div>
      )
    }
  }

  return (
    <div>
      {/* <p>{beforeThisMonth}</p> */}
      <div>
        <p className='text-gray-60 font-semibold text-center mb-2'>
          {monthName}, {year}
        </p>
      </div>

      <div className='grid grid-cols-7 gap-2' data-testid='calendar'>
        {availability}
      </div>
    </div>
  )
}
