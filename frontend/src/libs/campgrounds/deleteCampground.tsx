export default async function deleteCampground(token: string, cgid: string) {
  console.log(cgid)
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/campgrounds/${cgid}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok) {
    throw new Error('Cannot delete campground')
  }

  return await response.json()
}
