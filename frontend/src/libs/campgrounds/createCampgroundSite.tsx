export default async function createCampgroundSite(
  token: string,
  cgid: string,
  zone: string,
  number: number,
  size: {
    swidth: number
    slength: number
  }
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/sites`,
    {
      method: 'POST',
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
    throw new Error('Cannot create campground site')
  }

  alert(
    'Create campground site successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
