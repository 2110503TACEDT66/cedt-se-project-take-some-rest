export default async function updateUser(
  token: string,
  uid: string,
  name: string,
  tel: string,
  email: string
) {
  let bodyData = { name: name, tel: tel, email: email }

  console.log(bodyData)

  const response = await fetch(`${process.env.BACKEND_URL}/api/users/${uid}`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  })

  if (!response.ok) {
    throw new Error("Cannot update user's profile")
  }

  return await response.json()
}
