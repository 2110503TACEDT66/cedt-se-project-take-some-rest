import { redirect } from 'next/navigation'

export default async function getReserve(token: string, rid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/${rid}`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (response.status.toString().slice(0, 1)[0] === '4') {
    alert((await response.json()).message)
    return null
  }

  if (response.status === 500) {
    return null
  }

  if (!response.ok) {
    throw new Error('Cannot fetch booking data')
  }

  return response.json()
}
