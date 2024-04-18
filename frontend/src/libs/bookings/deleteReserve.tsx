export default async function deleteReserve(token: string, rid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/${rid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot delete reserve')
  }

  return await response.json()
}
