export default async function getUser(token: string, uid: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/${uid}`, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
