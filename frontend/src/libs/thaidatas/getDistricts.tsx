export default async function getDistricts(pid: number) {
  const response = await fetch(
    `https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json`
  )

  if (!response.ok) {
    throw new Error('Cannot fetch campground data')
  }

  const data = await response.json()
  const returnedData = data.filter((data: any) => data.province_id === pid)

  return returnedData
}
