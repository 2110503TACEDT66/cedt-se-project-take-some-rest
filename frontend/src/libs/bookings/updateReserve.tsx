export default async function updateReserve(
  token: string,
  rid: string,
  cgid: string,
  sid: string,
  startDate: string,
  tentSize: {
    swidth: number
    slength: number
  },
  amount: number,
  preferredName: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reserves/${rid}`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campground: cgid,
        site: sid,
        startDate: startDate,
        tentSize: tentSize,
        amount: amount,
        preferredName: preferredName,
      }),
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot update booking')
  }

  alert(
    'Update booking successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
