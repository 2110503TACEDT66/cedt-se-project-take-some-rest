export default async function userRequestToBeCampgroundOwner(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/me/campground-owner-request`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot request to be a campground owner')
  }

  alert('Request to be a campground owner successfully.')

  return await response.json()
}
