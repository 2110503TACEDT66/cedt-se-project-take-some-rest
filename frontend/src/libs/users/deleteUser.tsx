export default async function deleteUser(token: string, uid: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/${uid}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  })

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot delete user')
  }

  alert(
    'Delete user successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
