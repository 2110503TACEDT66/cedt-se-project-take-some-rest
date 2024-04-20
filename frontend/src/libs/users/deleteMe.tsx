export default async function deleteMe(token: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  })

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot delete your account')
  }

  alert('Delete account successfully.')

  return await response.json()
}
