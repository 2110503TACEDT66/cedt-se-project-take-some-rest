export default async function getBookedReserves(query?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/booked-reserves?${query}&limit=1000`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Data cannot fetch')
  }

  return response.json()
}
