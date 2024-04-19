export default async function updateMe(
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

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error("Cannot update user's profile")
  }

  alert(
    'Update profile successfully. Please refresh the page if data is not updated.'
  )

  return await response.json()
}
