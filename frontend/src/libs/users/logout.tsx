export default async function logout(token: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  })

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot logout')
  }

  return await response.json()
}
