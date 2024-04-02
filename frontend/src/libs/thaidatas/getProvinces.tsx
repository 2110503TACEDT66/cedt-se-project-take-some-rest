export default async function getProvinces() {
  const response = await fetch(
    `https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json`
  )

  if (!response.ok) {
    throw new Error('Cannot fetch campground data')
  }

  return response.json()
}
