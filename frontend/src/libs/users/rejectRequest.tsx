export default async function rejectRequest(token: string, uid: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/update-role/${uid}/reject`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestToBeCampgroundOwner: false,
      }),
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error("Cannot reject user's request")
  }

  alert(
    "Reject user's request successfully. Please refresh the page if data is not updated."
  )

  return await response.json()
}
