export default async function deleteUser(token: string, uid: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/${uid}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error("Cannot delete user's profile")
  }

  return await response.json()
}
