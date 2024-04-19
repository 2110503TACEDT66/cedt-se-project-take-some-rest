export default async function deleteLog(token: string, lid: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/logs/${lid}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  })

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot delete log')
  }

  alert(
    'Delete log successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
