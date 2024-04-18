export default async function getReserve(token: string, rid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/${rid}`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch booking data')
  }

  return response.json()
}
