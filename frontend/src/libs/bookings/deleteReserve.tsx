export default async function deleteReserve(token: string, rid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/${rid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
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
    throw new Error('Cannot delete reserve')
  }

  alert(
    'Delete booking successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
