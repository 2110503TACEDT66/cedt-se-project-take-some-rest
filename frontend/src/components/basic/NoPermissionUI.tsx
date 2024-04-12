import Link from 'next/link'

import Card from './card/Card'

export default function NoPermissionUI() {
  return (
    <div className='w-full px-24 py-16'>
      <Card>
        <div className='h-72 text-center text-3xl grid content-center gap-2'>
          <p>You don't have permission to access this page.</p>
          <p>Please login with other account that has permission instead.</p>
          <Link
            href='/'
            className='text-xl text-cgr-dark-green pt-6 hover:underline'>
            Back to home page
            <i className='bi bi-arrow-right ml-2'></i>
          </Link>
        </div>
      </Card>
    </div>
  )
}
