export default async function getCampgroundSite(cgid: string, sid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/sites/${sid}`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch campground site data')
  }

  return response.json()
}
