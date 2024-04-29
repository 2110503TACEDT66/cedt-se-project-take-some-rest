export default async function getCampgrounds(query?: string) {
  if (!query?.includes('limit')) {
    query = query + '&limit=1000'
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds?${query}`,
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
    throw new Error('Cannot fetch campgrounds data')
  }

  return response.json()
}
