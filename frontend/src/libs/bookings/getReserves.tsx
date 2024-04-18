export default async function getReserves(token: string, query?: string) {
  console.log(query)

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves?${query}&limit=1000`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch bookings data')
  }

  return response.json()
}
