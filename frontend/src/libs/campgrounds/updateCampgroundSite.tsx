export default async function updateCampgroundSite(
  token: string,
  cgid: string,
  sid: string,
  zone: string,
  number: number,
  size: {
    swidth: number
    slength: number
  }
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/sites/${sid}`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zone: zone,
        number: number,
        size: size,
      }),
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot update campground site')
  }

  return await response.json()
}
