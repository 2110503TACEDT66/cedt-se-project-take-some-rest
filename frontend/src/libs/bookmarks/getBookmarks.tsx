export default async function getBookmarks(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/my-bookmark`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch bookmarks data')
  }

  return response.json()
}
