export default async function getCampgroundSites(cgid: string, query?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/sites?${query}&limit=1000`,
    { cache: 'no-store' }
  )

  if (response.status.toString().slice(0, 1)[0] === '4') {
    alert((await response.json()).message)
    return null
  }

  if (response.status === 500) {
    return null
  }

  if (!response.ok) {
    throw new Error('Cannot fetch campground sites data')
  }

  return response.json()
}
