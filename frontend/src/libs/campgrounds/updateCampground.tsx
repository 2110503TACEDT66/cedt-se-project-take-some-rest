export default async function updateCampground(
  token: string,
  cgid: string,
  name: string,
  tel: string,
  address: {
    houseNumber: string
    lane: string
    road: string
    subDistrict: string
    district: string
    province: string
    postalCode: string
    link: string
  },
  website: string,
  facilities: string[]
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        tel: tel,
        address: address,
        website: website,
        facilities: facilities,
      }),
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot update campground')
  }

  alert(
    'Update campground successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
