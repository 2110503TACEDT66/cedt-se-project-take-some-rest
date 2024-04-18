export default async function getUsers(token: string, query?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users?${query}&limit=1000`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch users data')
  }

  return response.json()
}
