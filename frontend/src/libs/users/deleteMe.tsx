export default async function deleteMe(token: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
