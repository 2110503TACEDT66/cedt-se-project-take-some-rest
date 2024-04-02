export default async function deleteLog(token: string, lid: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/logs/${lid}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
