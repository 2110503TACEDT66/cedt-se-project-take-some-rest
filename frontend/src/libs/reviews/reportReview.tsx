export default async function reportReview(rvid: string, token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reviews/${rvid}`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot report this review')
  }

  return await response.json()
}
