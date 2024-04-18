export default async function addBookmark(token: string, campgroundId: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/my-bookmark/${campgroundId}`,
    {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot add bookmark')
  }

  return response.json()
}
