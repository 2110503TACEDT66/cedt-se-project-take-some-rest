export default async function updateUserRole(
  token: string,
  uid: string,
  role: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/update-role/${uid}`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: role,
      }),
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error("Cannot update user's role")
  }

  alert(
    'Update user role successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
