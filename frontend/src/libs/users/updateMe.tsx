export default async function uploadMe(
  token: string,
  name: string,
  tel: string,
  email: string,
  password?: string
) {
  let bodyData
  if (password) {
    bodyData = { name: name, tel: tel, email: email, password: password }
  } else {
    bodyData = { name: name, tel: tel, email: email }
  }

  console.log(bodyData)

  const response = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  })

  if (!response.ok) {
    throw new Error("Cannot fetch user's profile")
  }

  return await response.json()
}
