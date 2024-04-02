export default async function deleteCampgroundSite(
  token: string,
  cgid: string,
  sid: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/sites/${sid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok) {
    throw new Error('Cannot delete campground')
  }

  return await response.json()
}
