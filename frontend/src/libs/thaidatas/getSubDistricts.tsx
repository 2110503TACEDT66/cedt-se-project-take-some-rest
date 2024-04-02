export default async function getSubDistricts(did: number) {
  const response = await fetch(
    `https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json`
  )

  if (!response.ok) {
    throw new Error('Cannot fetch campground data')
  }

  const data = await response.json()
  const returnedData = data.filter((data: any) => data.amphure_id === did)

  return returnedData
}
