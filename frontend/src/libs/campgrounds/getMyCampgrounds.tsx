export default async function getMyCampgrounds(token: string, query?: string) {
  if (!query?.includes('limit')) {
    query = query + '&limit=1000'
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/my-campground?${query}`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch my campgrounds data')
  }

  return response.json()
}
