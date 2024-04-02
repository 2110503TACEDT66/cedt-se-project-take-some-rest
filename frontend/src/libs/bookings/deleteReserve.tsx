export default async function deleteReserves(token: string, rid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/${rid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
