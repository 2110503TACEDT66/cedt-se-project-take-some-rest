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

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error("Cannot update user's profile")
  }

  alert(
    'Update user successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
