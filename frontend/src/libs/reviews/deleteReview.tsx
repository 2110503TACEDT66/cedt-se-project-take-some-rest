export default async function deleteReview(token: string, rvid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reviews/${rvid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok) {
    throw new Error('Cannot Delete Review')
  }

  return await response.json()
}
