export default async function updateUserRequest(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/me/campground-owner-request`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestToBeCampgroundOwner: true,
      }),
    }
  )

  if (!response.ok) {
    throw new Error("Cannot update user's Role")
  }

  return await response.json()
}
