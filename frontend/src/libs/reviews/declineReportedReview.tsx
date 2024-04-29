export default async function declineReportedReview(
  rvid: string,
  token: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reviews/${rvid}/report-decline`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot decline this report review')
  }

  return await response.json()
}
