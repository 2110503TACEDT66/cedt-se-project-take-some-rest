export default async function getUserRequests(token: string, query?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/campground-owner-request`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot fetch user requests data')
  }

  return response.json()
}
