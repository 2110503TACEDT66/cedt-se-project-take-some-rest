export default async function getLogs(token: string, query?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/logs?${query}&limit=1000`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
