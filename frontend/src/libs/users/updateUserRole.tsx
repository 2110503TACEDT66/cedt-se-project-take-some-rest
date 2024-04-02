export default async function updateUser(
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

  if (!response.ok) {
    throw new Error("Cannot update user's role")
  }

  return await response.json()
}
