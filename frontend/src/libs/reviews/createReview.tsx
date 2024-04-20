export default async function createReview(
  userID: string,
  campgroundID: string,
  score: number,
  comment?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${campgroundID}/reviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userID}`,
      },
      body: JSON.stringify({
        user: userID,
        campground: campgroundID,
        score: score,
        comment: comment,
      }),
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot create review')
  }

  alert(
    `Create review successfully. Please refresh the page if data is not updated.`
  )

  return await response.json()
}
