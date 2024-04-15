export default async function getAllUserRequests (token: string, query={ "requestToBeCampgroundOwner": {"eq": "true"}}) {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/users/campground-owner-request`,
      {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    )
  
    if (!response.ok) {
      throw new Error("Cannot fetch user's profile")
    }
  
    return response.json()
  }