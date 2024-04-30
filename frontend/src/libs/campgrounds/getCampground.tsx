export default async function getCampground(cgid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}`,
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
    throw new Error('Cannot fetch campground data')
  }

  return response.json()
}
