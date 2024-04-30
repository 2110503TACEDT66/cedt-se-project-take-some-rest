export default async function getReportedReviews(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reviews/reported-review`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch reported reviews data')
  }

  return await response.json()
}
