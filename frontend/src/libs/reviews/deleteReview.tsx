export default async function deleteReview(token: string, rvid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reviews/${rvid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot delete review')
  }

  return await response.json()
}
