export default async function removeBookmark(
  token: string,
  campgroundId: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/my-bookmark/${campgroundId}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Data cannot fetch, can not remove bookmark')
  }

  return response.json()
}
