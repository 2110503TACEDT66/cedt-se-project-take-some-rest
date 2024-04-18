export default async function getAllUserRequests(
  token: string,
  query?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/campground-owner-request`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch user requests ')
  }

  return response.json()
}
