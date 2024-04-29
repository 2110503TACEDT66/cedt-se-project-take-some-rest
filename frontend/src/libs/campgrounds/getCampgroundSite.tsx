export default async function getCampgroundSite(cgid: string, sid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}/sites/${sid}`,
    { cache: 'no-store' }
  )

  console.log(response.status)
  if (response.status.toString().slice(0, 1)[0] === '4') {
    alert((await response.json()).message)
    return null
  }

  if (response.status === 500) {
    return null
  }

  if (!response.ok) {
    throw new Error('Cannot fetch campground site data')
  }

  return response.json()
}
