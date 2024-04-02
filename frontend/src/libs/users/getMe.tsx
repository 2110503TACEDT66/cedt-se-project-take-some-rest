export default async function getMe(token: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
