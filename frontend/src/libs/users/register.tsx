export default async function register(
  name: string,
  tel: string,
  email: string,
  password: string
) {
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

  if (response.status === 400) {
    alert((await response.json()).message)
    return await response.json()
  }

  if (!response.ok) {
    throw new Error('Cannot register')
  }

  alert('Registered successfully')

  return await response.json()
}
