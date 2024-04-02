export default async function userLogin(
  name: string,
  tel: string,
  email: string,
  password: string
) {
  console.log('registering')
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      tel: tel,
      email: email,
      password: password,
      role: 'customer',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to register')
  }

  return await response.json()
}
