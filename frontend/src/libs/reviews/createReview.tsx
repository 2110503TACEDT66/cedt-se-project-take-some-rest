export default async function createReview(userID: string, campgroundID: string, score: number, comment?: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/campgrounds/${campgroundID}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userID}`,
        },
        body: JSON.stringify({
            user: userID,
            campground: campgroundID,
            score: score,
            comment: comment,
        }),
    }) 
    if (!response.ok) {
        throw new Error('Failed to create review')
    }
    return await response.json()
}