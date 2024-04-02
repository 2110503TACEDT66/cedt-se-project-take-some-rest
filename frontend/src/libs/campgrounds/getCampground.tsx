export default async function getCampground(cgid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch campground data')
  }

  return response.json()
}
