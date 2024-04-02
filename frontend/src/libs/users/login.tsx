export default async function userLogin(
  userEmail: string,
  userPassword: string
) {
  console.log('logging in')
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, password: userPassword }),
  })

  if (!response.ok) {
    throw new Error('Failed to login')
  }

  return await response.json()
}
