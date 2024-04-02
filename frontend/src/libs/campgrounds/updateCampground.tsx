export default async function createCampground(
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
  facilities: string[],
  tentForRent: boolean
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
        tentForRent: tentForRent,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to register')
  }

  return await response.json()
}
