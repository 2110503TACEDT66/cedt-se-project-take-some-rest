export default async function addBookmark(token: string,campgroundId: string) {
    const response = await fetch(
        `${process.env.BACKEND_URL}/api/users/my-bookmark/${campgroundId}`,
        {
          method: 'POST',
          headers: {authorization: `Bearer ${token}`},
          cache: 'no-store',
        }
      )
      if (!response.ok) {
        throw new Error('Data cannot fetch, can not add bookmark')
      }
    
      return response.json()
}