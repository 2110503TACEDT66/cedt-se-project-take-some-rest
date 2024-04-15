export default async function rejectRequest(
  token: string,
  uid : string
) {
  
  const response = await fetch(`${process.env.BACKEND_URL}/api/users/update-role/${uid}/reject`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requestToBeCampgroundOwner: false,
    }),
  })

  if (!response.ok) {
    throw new Error("Cannot reject user's request")
  }

  return await response.json()
}
