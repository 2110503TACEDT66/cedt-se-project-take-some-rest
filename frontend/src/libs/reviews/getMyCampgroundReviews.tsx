export default async function getMyCampgroundReviews() {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/reviews/my-campgrounds`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )
  
    if (!response.ok) {
      throw new Error('Cannot fetch reviews data')
    }
  
    return await response.json()
  }
  