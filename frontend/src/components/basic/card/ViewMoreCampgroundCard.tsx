import Link from 'next/link'

import Card from './Card'

export default function ViewMoreCampgroundCard() {
  return (
    <Link
      href={'/campgrounds'}
      className='hover:scale-105 duration-300 flex h-full'>
      <Card>
        <div className='text-center p-10 h-full content-center grid'>
          <div>
            <i className='bi bi-search text-7xl drop-shadow-2xl'></i>
            <h1 className='text-2xl font-medium drop-shadow-2xl mt-4'>
              View More
            </h1>
          </div>
        </div>
      </Card>
    </Link>
  )
}
