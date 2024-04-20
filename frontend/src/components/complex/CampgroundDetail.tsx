import Link from 'next/link'
import Tag from '../basic/Tag'

export default function CampgroundDetail({
  address,
  googleMap,
  website,
  tel,
  facilities,
}: {
  address: string
  googleMap: string
  website: string
  tel: string
  facilities: string[]
}) {
  let googleMapString
  let websiteString
  if (website) websiteString = website.split('/').slice(0, 3).join('/')
  if (googleMap) googleMapString = googleMap.split('/').slice(0, 3).join('/')

  return (
    <div className='w-full text-wrap'>
      {/* address */}
      <div className='flex flex-row my-3'>
        <h1 className='text-xl font-semibold mr-4'>Address</h1>
        <p className='text-lg'>{address}</p>
      </div>

      {/* detail */}
      {/* <div className='grid grid-cols-4 gap-1'>
        <h1 className='cols-span-1'>Google Map</h1>
        <p className='cols-span-3'>{googleMapString}</p>
      </div> */}
      <table className='text-left my-3 divide-y divide-cgr-gray-40 w-full relative'>
        <tr className='h-10'>
          <th className='w-48'>Google Map</th>
          <td>
            {googleMap ? (
              <Link
                href={googleMap}
                target='_blank'
                className='hover:underline hover:decoration-solid hover:decoration-1'>
                {googleMapString}
                <i className='bi bi-link-45deg ml-2'></i>
              </Link>
            ) : (
              'No link'
            )}
          </td>
        </tr>
        <tr className='h-10'>
          <th className='w-48'>Website</th>
          <td>
            {website ? (
              <Link
                href={website}
                target='_blank'
                className='hover:underline hover:decoration-solid hover:decoration-1'>
                {websiteString}
                <i className='bi bi-link-45deg ml-2'></i>
              </Link>
            ) : (
              'No link'
            )}
          </td>
        </tr>
        <tr className='h-10'>
          <th className='w-48'>Telephone Number</th>
          <td>{tel}</td>
        </tr>
      </table>

      {/* tag */}
      <h1 className='text-md font-medium'>Facilities</h1>
      <div className='flex flex-wrap gap-3'>
        {facilities.map((obj) => (
          <Tag size='sm' key={obj}>
            {obj}
          </Tag>
        ))}
      </div>
    </div>
  )
}
