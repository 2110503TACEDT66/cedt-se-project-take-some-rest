export default async function deleteCampground(token: string, cgid: string) {
  console.log(cgid)
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot delete campground')
  }

  alert(
    'Delete campground successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
