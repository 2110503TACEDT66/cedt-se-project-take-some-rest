export default async function uploadCampgroundImage(
  token: string,
  cgid: string,
  image: FormData
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/upload-image`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: image,
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot upload campground image')
  }

  return await response.json()
}
